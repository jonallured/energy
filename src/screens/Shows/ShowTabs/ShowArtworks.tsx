import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { ArtworksList } from "components/Lists/ArtworksList"
import { SelectModePortal } from "components/SelectModePortal"
import { TabsScrollView } from "components/Tabs/TabsContent"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { extractNodes } from "utils/extractNodes"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"

interface ShowArtworksProps {
  slug: string
}

export const ShowArtworks: React.FC<ShowArtworksProps> = ({ slug }) => {
  const artworksData = useSystemQueryLoader<ShowArtworksQuery>(showArtworksQuery, {
    slug,
  })
  const artworks = extractNodes(artworksData.show?.artworksConnection)
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  return (
    <>
      <SelectModePortal tabName="ShowArtworks" items={presentedArtworks} />

      <TabsScrollView>
        <ArtworksList artworks={presentedArtworks} />
      </TabsScrollView>
    </>
  )
}

export const showArtworksQuery = graphql`
  query ShowArtworksQuery($slug: String!) {
    show(id: $slug) {
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
