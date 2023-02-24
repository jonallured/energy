import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { difference } from "lodash"
import { useEffect } from "react"
import { graphql } from "react-relay"
import { AlbumDocumentsQuery } from "__generated__/AlbumDocumentsQuery.graphql"
import { DocumentGridItem } from "app/components/Items/DocumentGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"

export const AlbumDocuments = ({ documentIDs }: { documentIDs: string[] }) => {
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const space = useSpace()

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
      GlobalStore.actions.albums.removeDocumentFromAlbums({ documentId })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentIDs])

  return (
    <TabsScrollView>
      <MasonryList
        contentContainerStyle={{
          marginTop: space(2),
          paddingHorizontal: space(2),
        }}
        numColumns={2}
        data={documents}
        renderItem={({ item: document }) => (
          <DocumentGridItem
            document={{
              url: document.publicURL,
              title: document.title,
              id: document.internalID,
              size: document.filesize,
            }}
          />
        )}
        keyExtractor={(item) => item.internalID}
        ListEmptyComponent={<ListEmptyComponent text="No documents" />}
      />
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
