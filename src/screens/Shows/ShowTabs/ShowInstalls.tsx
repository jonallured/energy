import { Tabs } from "@artsy/palette-mobile"
import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { InstallationsList } from "components/Lists/InstallationsList"
import { SelectModePortal } from "components/SelectModePortal"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { SelectedItemInstall } from "system/store/Models/SelectModeModel"

export const ShowInstalls = ({ slug }: { slug: string }) => {
  const data = useSystemQueryLoader<ShowInstallsQuery>(showInstallsQuery, {
    slug,
  })

  const installs = (data?.show?.images as SelectedItemInstall[]) ?? []

  return (
    <>
      <SelectModePortal tabName="ShowInstalls" items={installs} />

      <Tabs.ScrollView>
        <InstallationsList images={installs} />
      </Tabs.ScrollView>
    </>
  )
}

export const showInstallsQuery = graphql`
  query ShowInstallsQuery($slug: String!) {
    show(id: $slug) {
      images(default: true) {
        __typename
        internalID
        width
        height
        url
      }
    }
  }
`
