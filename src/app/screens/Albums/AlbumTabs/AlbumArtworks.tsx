import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { AlbumArtworksQuery } from "__generated__/AlbumArtworksQuery.graphql"
import { ArtworkGridItem } from "app/components/Items/ArtworkGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"

export const AlbumArtworks = ({ artworkIds }: { artworkIds: string[] }) => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const space = useSpace()

  const artworksData = useSystemQueryLoader<AlbumArtworksQuery>(albumArtworksQuery, {
    partnerID,
    artworkIDs: artworkIds,
  })
  const artworks =
    artworkIds.length > 0 ? extractNodes(artworksData.partner?.artworksConnection) : []

  // Filterering based on presentation mode
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  return (
    <TabsScrollView>
      <MasonryList
        contentContainerStyle={{
          marginTop: space(2),
          paddingHorizontal: space(2),
        }}
        numColumns={isTablet() ? 3 : 2}
        data={presentedArtworks}
        renderItem={({ item: artwork, i }) => (
          <ArtworkGridItem
            artwork={artwork}
            style={{
              marginLeft: i % 2 === 0 ? 0 : space("1"),
              marginRight: i % 2 === 0 ? space("1") : 0,
            }}
          />
        )}
        keyExtractor={(item) => item.internalID}
        ListEmptyComponent={<ListEmptyComponent text="No artworks" />}
      />
    </TabsScrollView>
  )
}

export const albumArtworksQuery = graphql`
  query AlbumArtworksQuery($partnerID: String!, $artworkIDs: [String]) {
    partner(id: $partnerID) {
      artworksConnection(first: 100, artworkIDs: $artworkIDs, includeUnpublished: true) {
        edges {
          node {
            internalID
            slug
            published
            availability
            ...ArtworkGridItem_artwork
          }
        }
      }
    }
  }
`
