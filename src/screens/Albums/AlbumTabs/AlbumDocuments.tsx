import { AlbumDocumentsQuery } from "__generated__/AlbumDocumentsQuery.graphql"
import { DocumentList } from "components/Lists/DocumentList"
import { TabsScrollView } from "components/Tabs/TabsContent"
import { difference } from "lodash"
import { useEffect } from "react"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemDocument } from "system/store/Models/SelectModeModel"
import { extractNodes } from "utils/extractNodes"

export const AlbumDocuments = ({ documentIDs }: { documentIDs: string[] }) => {
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!

  const documentsData = useSystemQueryLoader<AlbumDocumentsQuery>(albumDocumentsQuery, {
    partnerID,
    documentIDs,
  })

  const documents =
    documentIDs.length > 0 ? extractNodes(documentsData.partner?.documentsConnection) : []

  // Clear out potentially deleted documents
  useEffect(() => {
    const fetchedDocumentIds = documents.map((d) => d.internalID)
    const documentIdsToRemove = difference(documentIDs, fetchedDocumentIds)

    documentIdsToRemove.forEach((documentId) => {
      GlobalStore.actions.albums.removeItemFromAlbums(documentId)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentIDs])

  return (
    <TabsScrollView>
      <DocumentList documents={documents as SelectedItemDocument[]} />
    </TabsScrollView>
  )
}

export const albumDocumentsQuery = graphql`
  query AlbumDocumentsQuery($partnerID: String!, $documentIDs: [String]) {
    partner(id: $partnerID) {
      documentsConnection(first: 100, documentIDs: $documentIDs) {
        edges {
          node {
            internalID
            title
            filesize
            publicURL
          }
        }
      }
    }
  }
`
