import { RouteProp, useRoute } from "@react-navigation/native"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowArtworks } from "./ShowArtworks/ShowArtworks"
import { ShowInstalls } from "./ShowInstalls/ShowInstalls"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { Header } from "app/sharedUI"
import { TabsContainer } from "app/wrappers"

type ShowTabsRoute = RouteProp<HomeTabsScreens, "ArtistTabs">
type ShowTabsProps = {
  slug: string
}

export const ShowTabs: React.FC<ShowTabsProps> = () => {
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
    <TabsContainer header={(props) => <Header label={data.show?.name!} {...props} />}>
      <Tabs.Tab name="ShowArtworks" label="Works">
        <ShowArtworks slug={slug} />
      </Tabs.Tab>
      <Tabs.Tab name="ShowInstalls" label="Installs">
        <ShowInstalls slug={slug} />
      </Tabs.Tab>
    </TabsContainer>
  )
}
