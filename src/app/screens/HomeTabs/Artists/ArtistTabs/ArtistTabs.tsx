import { RouteProp, useRoute } from "@react-navigation/native"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistArtworks } from "./ArtistArtworks/ArtistArtworks"
import { ArtistShows } from "./ArtistShows/ArtistShows"
import { ArtistTabsQuery } from "__generated__/ArtistTabsQuery.graphql"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { Header } from "app/sharedUI"
import { SuspenseWrapper, TabsContainer } from "app/wrappers"

type ArtistTabsRoute = RouteProp<HomeTabsScreens, "ArtistTabs">
type ArtistTabsProps = {
  slug: string
}

export const ArtistTabs: React.FC<ArtistTabsProps> = () => {
  const { slug } = useRoute<ArtistTabsRoute>().params

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
        <SuspenseWrapper withTabs>
          <ArtistArtworks slug={slug} />
        </SuspenseWrapper>
      </Tabs.Tab>
      <Tabs.Tab name="ArtistShows" label="Shows">
        <SuspenseWrapper withTabs>
          <ArtistShows slug={slug} />
        </SuspenseWrapper>
      </Tabs.Tab>
    </TabsContainer>
  )
}
