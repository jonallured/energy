import { TabsContainer } from "app/wrappers/TabsContainer"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { ArtistTabsQuery } from "__generated__/ArtistTabsQuery.graphql"
import { ArtistArtworks } from "./ArtistArtworks/ArtistArtworks"
import { ArtistShows } from "./ArtistShows/ArtistShows"
import { SuspenseWrapper } from "app/wrappers/SuspenseWrapper"
import { RouteProp, useRoute } from "@react-navigation/native"
import { TabsScrollView } from "app/wrappers/TabsTestWrappers"
import { Header } from "app/sharedUI/Header"

type ArtistTabsRoute = RouteProp<HomeTabsScreens, "ArtistTabs">

export const ArtistTabs = () => {
  const { slug } = useRoute<ArtistTabsRoute>().params

  return (
    <SuspenseWrapper>
      <RenderArtist slug={slug} />
    </SuspenseWrapper>
  )
}

type RenderArtistProps = {
  slug: string
}

const RenderArtist: React.FC<RenderArtistProps> = ({ slug }) => {
  const data = useLazyLoadQuery<ArtistTabsQuery>(
    graphql`
      query ArtistTabsQuery($slug: String!) {
        artist(id: $slug) {
          name
        }
      }
    `,
    { slug }
  )

  return (
    <TabsContainer header={(props) => <Header label={data.artist?.name!} {...props} />}>
      <Tabs.Tab name="ArtistArtworks" label="Works">
        <ArtistArtworks slug={slug} />
      </Tabs.Tab>
      <Tabs.Tab name="ArtistShows" label="Shows">
        <ArtistShows slug={slug} />
      </Tabs.Tab>
    </TabsContainer>
  )
}
