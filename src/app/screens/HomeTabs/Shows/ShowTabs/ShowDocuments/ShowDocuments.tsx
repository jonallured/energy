import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowDocumentsQuery } from "__generated__/ShowDocumentsQuery.graphql"
import { ListEmptyComponent, DocumentGridItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { TabsScrollView } from "app/wrappers"
import { extractNodes } from "shared/utils"

export const ShowDocuments = ({ slug }: { slug: string }) => {
  const space = useSpace()
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)!
  const showDocumentsData = useLazyLoadQuery<ShowDocumentsQuery>(showDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })
  const documents = extractNodes(showDocumentsData.partnerShowDocumentsConnection)

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
              url: document.publicUrl,
              title: document.title,
              id: document.id,
              size: document.size,
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<ListEmptyComponent text="No documents" />}
      />
    </TabsScrollView>
  )
}

const showDocumentsQuery = graphql`
  query ShowDocumentsQuery($slug: String!, $partnerID: String!) {
    partnerShowDocumentsConnection(showID: $slug, partnerID: $partnerID, first: 100) {
      edges {
        node {
          id
          title
          size
          publicUrl
        }
      }
    }
  }
`
