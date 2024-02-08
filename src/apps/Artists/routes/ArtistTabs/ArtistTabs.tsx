import { Flex, Tabs } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationRoutes } from "Navigation"
import { SelectModeActions } from "components/SelectMode/SelectModeActions"
import { TabsView } from "components/TabsView"
import { ActivityIndicator } from "react-native"
import { TabScreen } from "system/wrappers/TabScreen"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"
import { useIsOnline } from "utils/hooks/useIsOnline"
import { ArtistArtworks } from "./ArtistArtworks"
import { ArtistDocuments } from "./ArtistDocuments"
import { ArtistShows } from "./ArtistShows"

type ArtistTabsRoute = RouteProp<NavigationRoutes, "ArtistTabs">

export const ArtistTabs = () => {
  const { slug, name } = useRoute<ArtistTabsRoute>().params
  const isOnline = useIsOnline()

  return (
    <>
      <SelectModeActions />

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
    </>
  )
}

export const SkeletonArtistTabs = () => {
  const isOnline = useIsOnline()
  const isDarkMode = useIsDarkMode()

  return (
    <TabsView title="" headerProps={{ hideRightElements: !isOnline }}>
      <Tabs.Tab name="ArtistArtworks" label="Works">
        <Tabs.ScrollView>
          <Flex my={2}>
            <ActivityIndicator color={isDarkMode ? "white" : "black"} />
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
