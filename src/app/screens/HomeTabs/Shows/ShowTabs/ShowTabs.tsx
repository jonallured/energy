import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"
import { ShowArtworks } from "./ShowArtworks/ShowArtworks"
import { ShowInstalls } from "./ShowInstalls/ShowInstalls"
import { RouteProp, useRoute } from "@react-navigation/native"
import { TabsContainer } from "app/wrappers"
import { Header } from "app/sharedUI"

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
      <Tabs.Tab name="ShowInstalls" label="Shows">
        <ShowInstalls />
      </Tabs.Tab>
    </TabsContainer>
  )
}
