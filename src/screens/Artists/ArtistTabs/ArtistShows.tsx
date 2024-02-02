import { ArtistShowsQuery } from "__generated__/ArtistShowsQuery.graphql"
import { ShowsList } from "components/Lists/ShowsList"
import { SelectModePortal } from "components/SelectModePortal"
import { graphql } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

interface ArtistShowsProps {
  slug: string
}

export const ArtistShows: React.FC<ArtistShowsProps> = ({ slug }) => {
  useTrackScreen({ name: "ArtistShows", type: "Artist", slug })

  const partnerID = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )!
  const { data, refreshControl } = useSystemQueryLoader<ArtistShowsQuery>(
    artistShowsQuery,
    {
      partnerID,
      slug,
    }
  )
  const shows = extractNodes(data.partner?.showsConnection)

  return (
    <>
      <SelectModePortal tabName="ArtistShows" items={[]} />

      <ShowsList shows={shows} refreshControl={refreshControl} />
    </>
  )
}

export const artistShowsQuery = graphql`
  query ArtistShowsQuery($partnerID: String!, $slug: String!)
  @raw_response_type {
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
