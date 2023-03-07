import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtworksList } from "app/components/Lists/ArtworksList"
import { SelectModePortal } from "app/components/SelectModePortal"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"
import { graphql } from "react-relay"

interface ArtistArtworkProps {
  slug: string
}

export const ArtistArtworks: React.FC<ArtistArtworkProps> = ({ slug }) => {
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const artworksData = useSystemQueryLoader<ArtistArtworksQuery>(artistArtworksQuery, {
    partnerID,
    slug,
  })

  const artworks = extractNodes(artworksData.partner?.artworksConnection)
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  return (
    <>
      <SelectModePortal tabName="ArtistArtworks" items={presentedArtworks} />

      <TabsScrollView>
        <ArtworksList artworks={presentedArtworks} />
      </TabsScrollView>
    </>
  )
}

export const artistArtworksQuery = graphql`
  query ArtistArtworksQuery($partnerID: String!, $slug: String!) {
    partner(id: $partnerID) {
      artworksConnection(first: 100, artistID: $slug, includeUnpublished: true) {
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
