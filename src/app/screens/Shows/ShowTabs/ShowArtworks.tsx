import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { ArtworksList } from "app/components/Lists/ArtworksList"
import { SelectModePortal } from "app/components/SelectModePortal"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { extractNodes } from "app/utils/extractNodes"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"
import { graphql } from "react-relay"

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
