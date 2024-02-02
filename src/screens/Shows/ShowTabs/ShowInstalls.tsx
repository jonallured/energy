import { Tabs } from "@artsy/palette-mobile"
import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { InstallationsList } from "components/Lists/InstallationsList"
import { graphql } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { SelectedItemInstall } from "system/store/Models/SelectModeModel"
import { useSetSelectModeActiveTab } from "utils/hooks/useSetSelectModeActiveTab"

interface ShowInstallsProps {
  slug: string
}

export const ShowInstalls: React.FC<ShowInstallsProps> = ({ slug }) => {
  useTrackScreen({ name: "ShowInstalls", type: "Show", slug })

  const { data, refreshControl } = useSystemQueryLoader<ShowInstallsQuery>(
    showInstallsQuery,
    {
      slug,
    }
  )

  const installs = (data?.show?.images as SelectedItemInstall[]) ?? []

  useSetSelectModeActiveTab({
    name: "ShowInstalls",
    items: installs,
  })

  return (
    <>
      <Tabs.ScrollView refreshControl={refreshControl}>
        <InstallationsList images={installs} />
      </Tabs.ScrollView>
    </>
  )
}

export const showInstallsQuery = graphql`
  query ShowInstallsQuery($slug: String!) {
    show(id: $slug, includeAllShows: true) {
      images {
        __typename
        internalID
        width
        height
        url
      }
    }
  }
`
