import { Tabs } from "@artsy/palette-mobile"
import { AlbumArtworksQuery } from "__generated__/AlbumArtworksQuery.graphql"
import { ArtworksList } from "components/Lists/ArtworksList"
import { graphql } from "react-relay"
import { useAlbum } from "screens/Albums/useAlbum"
import { useValidateAlbumItems } from "screens/Albums/useValidateAlbumItems"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

interface AlbumArtworksProps {
  albumId: string
}

export const AlbumArtworks: React.FC<AlbumArtworksProps> = ({ albumId }) => {
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID as string)
  const { artworks } = useAlbum({ albumId })
  const artworkIDs = artworks.map((artwork) => artwork.internalID)

  useValidateAlbumItems<AlbumArtworksQuery>({
    query: albumArtworksQuery,
    variables: {
      artworkIDs,
      partnerID,
    },
    idsToValidate: artworkIDs,
    mapResponseToIDs: (data) => {
      return extractNodes(data?.partner?.artworksConnection).map((artwork) => artwork.internalID)
    },
  })

  return (
    <Tabs.ScrollView>
      <ArtworksList artworks={artworks} isStatic />
    </Tabs.ScrollView>
  )
}

export const albumArtworksQuery = graphql`
  query AlbumArtworksQuery($artworkIDs: [String], $partnerID: String!) {
    partner(id: $partnerID) {
      artworksConnection(first: 100, artworkIDs: $artworkIDs, includeUnpublished: true) {
        edges {
          node {
            internalID
          }
        }
      }
    }
  }
`
