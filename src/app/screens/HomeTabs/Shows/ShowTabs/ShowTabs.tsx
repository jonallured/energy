import { RouteProp, useRoute } from "@react-navigation/native"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header } from "app/sharedUI"
import { SuspenseWrapper, TabsContainer } from "app/wrappers"
import { ShowArtworks } from "./ShowArtworks/ShowArtworks"
import { ShowDocuments } from "./ShowDocuments/ShowDocuments"
import { ShowInstalls } from "./ShowInstalls/ShowInstalls"

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
    </TabsContainer>
  )
}
