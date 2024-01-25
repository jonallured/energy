import { Tabs } from "@artsy/palette-mobile"
import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { ArtworksList } from "components/Lists/ArtworksList"
import { SelectModePortal } from "components/SelectModePortal"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { extractNodes } from "utils/extractNodes"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"

interface ShowArtworksProps {
  slug: string
}

export const ShowArtworks: React.FC<ShowArtworksProps> = ({ slug }) => {
  const { data, refreshControl } = useSystemQueryLoader<ShowArtworksQuery>(showArtworksQuery, {
    slug,
  })
  const artworks = extractNodes(data.show?.artworksConnection)
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  return (
    <>
      <SelectModePortal tabName="ShowArtworks" items={presentedArtworks} />

      <Tabs.ScrollView refreshControl={refreshControl}>
        <ArtworksList artworks={presentedArtworks} />
      </Tabs.ScrollView>
    </>
  )
}

export const showArtworksQuery = graphql`
  query ShowArtworksQuery($slug: String!) {
    show(id: $slug, includeAllShows: true) {
      artworksConnection(first: 100) {
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
