import { Flex } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { TabScreen } from "components/Tabs/TabScreen"
import { TabsScrollView } from "components/Tabs/TabsScrollView"
import { TabsWithHeader } from "components/Tabs/TabsWithHeader"
import { ActivityIndicator } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
import { useIsOnline } from "utils/hooks/useIsOnline"
import { ArtistArtworks } from "./ArtistArtworks"
import { ArtistDocuments } from "./ArtistDocuments"
import { ArtistShows } from "./ArtistShows"

type ArtistTabsRoute = RouteProp<NavigationScreens, "ArtistTabs">

export const ArtistTabs = () => {
  const { slug, name } = useRoute<ArtistTabsRoute>().params
  const isOnline = useIsOnline()

  return (
    <TabsWithHeader title={name} headerProps={{ hideRightElements: !isOnline }}>
      <Tabs.Tab name="ArtistArtworks" label="Works">
        <TabScreen>
          <ArtistArtworks slug={slug} />
        </TabScreen>
      </Tabs.Tab>
      <Tabs.Tab name="ArtistShows" label="Shows">
        <TabScreen>
          <ArtistShows slug={slug} />
        </TabScreen>
      </Tabs.Tab>
      <Tabs.Tab name="ArtistDocuments" label="Documents">
        <TabScreen>
          <ArtistDocuments slug={slug} />
        </TabScreen>
      </Tabs.Tab>
    </TabsWithHeader>
  )
}

export const SkeletonArtistTabs = () => {
  const isOnline = useIsOnline()

  return (
    <TabsWithHeader title="" headerProps={{ hideRightElements: !isOnline }}>
      <Tabs.Tab name="ArtistArtworks" label="Works">
        <TabsScrollView>
          <Flex my={2}>
            <ActivityIndicator />
          </Flex>
        </TabsScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="ArtistShows" label="Shows">
        <></>
      </Tabs.Tab>
      <Tabs.Tab name="ArtistDocuments" label="Documents">
        <></>
      </Tabs.Tab>
    </TabsWithHeader>
  )
}
