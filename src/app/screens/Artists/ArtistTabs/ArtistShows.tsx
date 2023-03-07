import { ArtistShowsQuery } from "__generated__/ArtistShowsQuery.graphql"
import { ShowsList } from "app/components/Lists/ShowsList"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { graphql } from "react-relay"

export const ArtistShows = ({ slug }: { slug: string }) => {
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const showsData = useSystemQueryLoader<ArtistShowsQuery>(artistShowsQuery, {
    partnerID,
    slug,
  })
  const shows = extractNodes(showsData.partner?.showsConnection)

  return (
    <>
      <ShowsList shows={shows} />
    </>
  )
}

export const artistShowsQuery = graphql`
  query ArtistShowsQuery($partnerID: String!, $slug: String!) @raw_response_type {
    partner(id: $partnerID) {
      showsConnection(first: 100, status: ALL, artistID: $slug) {
        edges {
          node {
            ...ShowListItem_show
            internalID
            slug
          }
        }
      }
    }
  }
`
