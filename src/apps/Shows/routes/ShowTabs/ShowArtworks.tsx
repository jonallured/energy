import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { ShowArtworks_artworksConnection$key } from "__generated__/ShowArtworks_artworksConnection.graphql"
import { ArtworksList } from "components/Lists/ArtworksList"
import { graphql, usePaginationFragment } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { extractNodes } from "utils/extractNodes"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"
import { useSetSelectModeActiveTab } from "utils/hooks/useSetSelectModeActiveTab"

interface ShowArtworksProps {
  slug: string
}

export const ShowArtworks: React.FC<ShowArtworksProps> = ({ slug }) => {
  useTrackScreen({ name: "ShowArtworks", type: "Show", slug })

  const { data: queryData, refreshControl } =
    useSystemQueryLoader<ShowArtworksQuery>(showArtworksQuery, {
      slug,
    })

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    ShowArtworksQuery,
    ShowArtworks_artworksConnection$key
  >(showArtworksConnectionFragment, queryData.show)

  const artworks = extractNodes(data?.artworksConnection)
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  useSetSelectModeActiveTab({
    name: "ShowArtworks",
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

export const showArtworksQuery = graphql`
  query ShowArtworksQuery($slug: String!) {
    show(id: $slug, includeAllShows: true) {
      ...ShowArtworks_artworksConnection @arguments(first: 100)
    }
  }
`

const showArtworksConnectionFragment = graphql`
  fragment ShowArtworks_artworksConnection on Show
  @refetchable(queryName: "ShowArtworks_artworksConnectionRefetch")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
  ) {
    artworksConnection(first: $first, after: $after)
      @connection(key: "ShowArtworks_artworksConnection") {
      edges {
        node {
          ...Artwork_artworkProps @relay(mask: false)
          ...ArtworkGridItem_artwork
        }
      }
    }
  }
`

// FIXME: This is a temporary work around while we figure out how to paginate
// offline data. When that's done delete this and just use query up above.
export const showArtworksOfflineQuery = graphql`
  query ShowArtworksOfflineQuery($slug: String!) {
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
