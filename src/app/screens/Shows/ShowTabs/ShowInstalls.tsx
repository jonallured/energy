import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { InstallationsList } from "app/components/Lists/InstallationsList"
import { SelectModePortal } from "app/components/SelectModePortal"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { SelectedItemInstall } from "app/system/store/Models/SelectModeModel"
import { graphql } from "react-relay"

export const ShowInstalls = ({ slug }: { slug: string }) => {
  const data = useSystemQueryLoader<ShowInstallsQuery>(showInstallsQuery, {
    slug,
  })

  const installs = data.show?.images as SelectedItemInstall[]

  return (
    <>
      <SelectModePortal tabName="ShowInstalls" items={installs} />

      <TabsScrollView>
        <InstallationsList images={installs} />
      </TabsScrollView>
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
