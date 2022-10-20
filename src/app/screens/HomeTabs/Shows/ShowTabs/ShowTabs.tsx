import { RouteProp, useRoute } from "@react-navigation/native"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { SuspenseWrapper } from "app/wrappers"
import { Screen } from "palette"
import { ShowArtworks } from "./ShowArtworks/ShowArtworks"
import { ShowDocuments } from "./ShowDocuments/ShowDocuments"
import { ShowInstalls } from "./ShowInstalls/ShowInstalls"

type ShowTabsRoute = RouteProp<NavigationScreens, "ArtistTabs">

export const ShowTabs = () => {
  const { slug } = useRoute<ShowTabsRoute>().params

  const data = useLazyLoadQuery<ShowTabsQuery>(
    graphql`
      query ShowTabsQuery($slug: String!) {
        show(id: $slug) {
          name
        }
      }
    `,
    { slug }
  )

  return (
    <Screen>
      <Screen.AnimatedTitleHeader title={data.show?.name!} />
      <Screen.AnimatedTitleTabsBody>
        <Tabs.Tab name="ShowArtworks" label="Works">
          <SuspenseWrapper withTabs>
            <ShowArtworks slug={slug} />
          </SuspenseWrapper>
        </Tabs.Tab>
        <Tabs.Tab name="ShowInstalls" label="Installs">
          <SuspenseWrapper withTabs>
            <ShowInstalls slug={slug} />
          </SuspenseWrapper>
        </Tabs.Tab>
        <Tabs.Tab name="ShowDocuments" label="Documents">
          <SuspenseWrapper withTabs>
            <ShowDocuments slug={slug} />
          </SuspenseWrapper>
        </Tabs.Tab>
      </Screen.AnimatedTitleTabsBody>
    </Screen>
  )
}
