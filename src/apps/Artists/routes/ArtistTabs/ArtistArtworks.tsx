import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtistArtworks_artworksConnection$key } from "__generated__/ArtistArtworks_artworksConnection.graphql"
import { ArtworksList } from "components/Lists/ArtworksList"
import { graphql, usePaginationFragment } from "react-relay"
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

  const { data: queryData, refreshControl } =
    useSystemQueryLoader<ArtistArtworksQuery>(artistArtworksQuery, {
      partnerID,
      slug,
    })

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    ArtistArtworksQuery,
    ArtistArtworks_artworksConnection$key
  >(artistArtworksConnectionFragment, queryData.partner)

  const artworks = extractNodes(data?.artworksConnection)
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  useSetSelectModeActiveTab({
    name: "ArtistArtworks",
    items: presentedArtworks,
  })

  return (
    <>
      <ArtworksList
        isInTabs
        artworks={presentedArtworks}
        hasNext={hasNext}
        loadMore={(pageSize) => {
          loadNext(pageSize)
        }}
        isLoadingNext={isLoadingNext}
        refreshControl={refreshControl}
      />
    </>
  )
}

export const artistArtworksQuery = graphql`
  query ArtistArtworksQuery($partnerID: String!, $slug: String!) {
    partner(id: $partnerID) {
      # Note: Large initial fetch; from here subsequent refetches are 10
      ...ArtistArtworks_artworksConnection @arguments(slug: $slug, first: 100)
    }
  }
`

export const artistArtworksConnectionFragment = graphql`
  fragment ArtistArtworks_artworksConnection on Partner
  @refetchable(queryName: "ArtistArtworks_artworksConnectionRefetch")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
    slug: { type: "String" }
  ) {
    artworksConnection(
      first: $first
      after: $after
      artistID: $slug
      includeUnpublished: true
    ) @connection(key: "ArtistArtworks_artworksConnection") {
      edges {
        node {
          ...Artwork_artworkProps @relay(mask: false)
          ...ArtworkGridItem_artwork
        }
      }
    }
  }
`

// FIXME: This is a temporary solution while we figure out how to paginate for
// offline data. Right now, just return 100. In the future roll it up into above.
export const artistArtworksOfflineQuery = graphql`
  query ArtistArtworksOfflineQuery($partnerID: String!, $slug: String!) {
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
