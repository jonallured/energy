import { AlbumArtworksQuery } from "__generated__/AlbumArtworksQuery.graphql"
import { useAlbum } from "apps/Albums/hooks/useAlbum"
import { useValidateAlbumItems } from "apps/Albums/hooks/useValidateAlbumItems"
import { ArtworksList } from "components/Lists/ArtworksList"
import { graphql } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

interface AlbumArtworksProps {
  albumId: string
}

export const AlbumArtworks: React.FC<AlbumArtworksProps> = ({ albumId }) => {
  useTrackScreen({ name: "AlbumArtworks", type: "Album" })

  const partnerID = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID as string
  )
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
      return extractNodes(data?.partner?.artworksConnection).map(
        (artwork) => artwork.internalID
      )
    },
  })

  return (
    <>
      <ArtworksList artworks={artworks} isStatic isInTabs />
    </>
  )
}

export const albumArtworksQuery = graphql`
  query AlbumArtworksQuery($artworkIDs: [String], $partnerID: String!) {
    partner(id: $partnerID) {
      artworksConnection(
        first: 100
        artworkIDs: $artworkIDs
        includeUnpublished: true
      ) {
        edges {
          node {
            internalID
          }
        }
      }
    }
  }
`
