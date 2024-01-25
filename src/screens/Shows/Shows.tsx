import { ShowsQuery } from "__generated__/ShowsQuery.graphql"
import { ShowsList } from "components/Lists/ShowsList"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

export const Shows = () => {
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)
  const { data, refreshControl } = useSystemQueryLoader<ShowsQuery>(showsQuery, {
    partnerID: partnerID!,
  })
  const shows = extractNodes(data.partner?.showsConnection)

  return (
    <>
      <ShowsList shows={shows} refreshControl={refreshControl} />
    </>
  )
}

export const showsQuery = graphql`
  query ShowsQuery($partnerID: String!) {
    partner(id: $partnerID) {
      showsConnection(first: 100, status: ALL) {
        edges {
          node {
            ...ShowListItem_show
            internalID
            slug
            artworksCount
            coverImage {
              url
            }
          }
        }
      }
    }
  }
`
