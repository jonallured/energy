import { Tabs } from "@artsy/palette-mobile"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtworksList } from "components/Lists/ArtworksList"
import { SelectModePortal } from "components/SelectModePortal"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"

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

      <Tabs.ScrollView>
        <ArtworksList artworks={presentedArtworks} />
      </Tabs.ScrollView>
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
