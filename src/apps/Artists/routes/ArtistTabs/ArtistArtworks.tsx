import { Tabs } from "@artsy/palette-mobile"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtworksList } from "components/Lists/ArtworksList"
import { graphql } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"
import { useSetSelectModeActiveTab } from "utils/hooks/useSetSelectModeActiveTab"

interface ArtistArtworkProps {
  slug: string
}

export const ArtistArtworks: React.FC<ArtistArtworkProps> = ({ slug }) => {
  useTrackScreen({ name: "ArtistArtworks", type: "Artist", slug })

  const partnerID = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )!

  const { data, refreshControl } = useSystemQueryLoader<ArtistArtworksQuery>(
    artistArtworksQuery,
    {
      partnerID,
      slug,
    }
  )

  const artworks = extractNodes(data.partner?.artworksConnection)
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  useSetSelectModeActiveTab({
    name: "ArtistArtworks",
    items: presentedArtworks,
  })

  return (
    <>
      <Tabs.ScrollView refreshControl={refreshControl}>
        <ArtworksList artworks={presentedArtworks} />
      </Tabs.ScrollView>
    </>
  )
}

export const artistArtworksQuery = graphql`
  query ArtistArtworksQuery($partnerID: String!, $slug: String!) {
    partner(id: $partnerID) {
      artworksConnection(
        first: 100
        artistID: $slug
        includeUnpublished: true
      ) {
        edges {
          node {
            ...Artwork_artworkProps @relay(mask: false)
            ...ArtworkGridItem_artwork
          }
        }
      }
    }
  }
`