import { MasonryList } from "@react-native-seoul/masonry-list"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistDocumentsQuery } from "__generated__/ArtistDocumentsQuery.graphql"
import { ListEmptyComponent, DocumentGridItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { TabsScrollView } from "app/wrappers"
import { useSpace } from "palette"
import { extractNodes } from "shared/utils"

export const ArtistDocuments = ({ slug }: { slug: string }) => {
  const space = useSpace()
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artistDocumentsData = useLazyLoadQuery<ArtistDocumentsQuery>(artistDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })
  const documents = extractNodes(artistDocumentsData.partnerArtistDocumentsConnection)

  return (
    <TabsScrollView>
      <MasonryList
        testID="artist-artwork-list"
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

const artistDocumentsQuery = graphql`
  query ArtistDocumentsQuery($slug: String!, $partnerID: String!) {
    partnerArtistDocumentsConnection(artistID: $slug, partnerID: $partnerID, first: 100) {
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
