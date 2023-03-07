import { AlbumDocumentsQuery } from "__generated__/AlbumDocumentsQuery.graphql"
import { DocumentList } from "app/components/Lists/DocumentList"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItemDocument } from "app/system/store/Models/SelectModeModel"
import { extractNodes } from "app/utils/extractNodes"
import { difference } from "lodash"
import { useEffect } from "react"
import { graphql } from "react-relay"

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
