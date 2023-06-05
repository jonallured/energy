import { Flex, Tabs } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { TabsView } from "components/TabsView"
import { ActivityIndicator } from "react-native"

import { TabScreen } from "system/wrappers/TabScreen"
import { useIsOnline } from "utils/hooks/useIsOnline"
import { ArtistArtworks } from "./ArtistArtworks"
import { ArtistDocuments } from "./ArtistDocuments"
import { ArtistShows } from "./ArtistShows"

type ArtistTabsRoute = RouteProp<NavigationScreens, "ArtistTabs">

export const ArtistTabs = () => {
  const { slug, name } = useRoute<ArtistTabsRoute>().params
  const isOnline = useIsOnline()

  return (
    <TabsView title={name} headerProps={{ hideRightElements: !isOnline }}>
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
    </TabsView>
  )
}

export const SkeletonArtistTabs = () => {
  const isOnline = useIsOnline()

  return (
    <TabsView title="" headerProps={{ hideRightElements: !isOnline }}>
      <Tabs.Tab name="ArtistArtworks" label="Works">
        <Tabs.ScrollView>
          <Flex my={2}>
            <ActivityIndicator />
          </Flex>
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="ArtistShows" label="Shows">
        <></>
      </Tabs.Tab>
      <Tabs.Tab name="ArtistDocuments" label="Documents">
        <></>
      </Tabs.Tab>
    </TabsView>
  )
}
