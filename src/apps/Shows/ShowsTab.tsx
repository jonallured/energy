import { ShowsTabQuery } from "__generated__/ShowsTabQuery.graphql"
import { ShowsList } from "components/Lists/ShowsList"
import { graphql } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

export const ShowsTab: React.FC = () => {
  useTrackScreen({ name: "Shows", type: "Shows" })

  const partnerID = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )
  const { data, refreshControl } = useSystemQueryLoader<ShowsTabQuery>(
    showsTabQuery,
    {
      partnerID: partnerID!,
    }
  )
  const shows = extractNodes(data.partner?.showsConnection)

  return (
    <>
      <ShowsList shows={shows} refreshControl={refreshControl} />
    </>
  )
}

export const showsTabQuery = graphql`
  query ShowsTabQuery($partnerID: String!) {
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
