import { RouteProp, useRoute } from "@react-navigation/native"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistTabsQuery } from "__generated__/ArtistTabsQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header } from "app/sharedUI"
import { SuspenseWrapper, TabsContainer } from "app/wrappers"
import { ArtistArtworks } from "./ArtistArtworks/ArtistArtworks"
import { ArtistDocuments } from "./ArtistDocuments/ArtistDocuments"
import { ArtistShows } from "./ArtistShows/ArtistShows"

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
      <Tabs.Tab name="ArtistDocuments" label="Documents">
        <SuspenseWrapper withTabs>
          <ArtistDocuments slug={slug} />
        </SuspenseWrapper>
      </Tabs.Tab>
    </TabsContainer>
  )
}
