import { Flex, useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { graphql, useLazyLoadQuery } from "react-relay"
import { AlbumDocumentsQuery } from "__generated__/AlbumDocumentsQuery.graphql"
import { DocumentGridItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { TabsScrollView } from "app/wrappers"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"
import { extractNodes } from "shared/utils"

export const AlbumDocuments = ({ documentIDs }: { documentIDs: string[] }) => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const space = useSpace()

  const documentsData = useLazyLoadQuery<AlbumDocumentsQuery>(albumDocumentsQuery, {
    partnerID,
    documentIDs,
  })

  const documents =
    documentIDs.length > 0 ? extractNodes(documentsData.partner?.documentsConnection) : []

  return (
    <TabsScrollView>
      <MasonryList
        contentContainerStyle={{
          marginTop: documents.length ? space("2") : 0,
          paddingRight: space("2"),
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
        ListEmptyComponent={
          <Flex ml={SCREEN_HORIZONTAL_PADDING}>
            <ListEmptyComponent text="No documents" />
          </Flex>
        }
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
