import { Flex } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { BottomSheetActions } from "components/BottomSheet/BottomSheetActions"
import { PortalProvider } from "components/Portal"
import { Screen } from "components/Screen"
import { TabScreen } from "components/Tabs/TabScreen"
import { TabsScrollView } from "components/Tabs/TabsContent"
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
    <BottomSheetModalProvider>
      <PortalProvider>
        <Screen>
          <Screen.AnimatedTitleHeader title={name} hideRightElements={!isOnline} />
          <Screen.AnimatedTitleTabsBody>
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
          </Screen.AnimatedTitleTabsBody>
        </Screen>
      </PortalProvider>

      <BottomSheetActions />
    </BottomSheetModalProvider>
  )
}

export const SkeletonArtistTabs = () => {
  const isOnline = useIsOnline()

  return (
    <Screen>
      <Screen.AnimatedTitleHeader title="" hideRightElements={!isOnline} />
      <Screen.AnimatedTitleTabsBody>
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
      </Screen.AnimatedTitleTabsBody>
    </Screen>
  )
}
