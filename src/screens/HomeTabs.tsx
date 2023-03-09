import { MenuIcon, Touchable, MagnifyingGlassIcon, DEFAULT_HIT_SLOP } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { Screen } from "components/Screen"
import { TabScreen } from "components/Tabs/TabScreen"
import { Tabs } from "react-native-collapsible-tab-view"
import { useSetupRageShake } from "system/devTools/useSetupRageShake"
import { useIsOnline } from "utils/hooks/useIsOnline"
import { Albums } from "./Albums/Albums"
import { Artists } from "./Artists/Artists"
import { Shows } from "./Shows/Shows"

type HomeTabsRoute = RouteProp<NavigationScreens, "HomeTabs">

export const HomeTabs = () => {
  const isOnline = useIsOnline()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { tabName } = useRoute<HomeTabsRoute>().params || { tabName: "Artists" }

  useSetupRageShake()

  return (
    <Screen>
      <Screen.Header
        title="Folio"
        leftElements={
          <Touchable hitSlop={DEFAULT_HIT_SLOP} onPress={() => navigation.navigate("Settings")}>
            <MenuIcon fill="onBackgroundHigh" />
          </Touchable>
        }
        rightElements={
          <>
            {isOnline && (
              <Touchable onPress={() => navigation.navigate("Search")} hitSlop={DEFAULT_HIT_SLOP}>
                <MagnifyingGlassIcon fill="onBackgroundHigh" />
              </Touchable>
            )}
          </>
        }
      />
      <Screen.TabsBody initialTabName={tabName}>
        <Tabs.Tab name="Artists" label="Artists">
          <TabScreen>
            <Artists />
          </TabScreen>
        </Tabs.Tab>
        <Tabs.Tab name="Shows" label="Shows">
          <TabScreen>
            <Shows />
          </TabScreen>
        </Tabs.Tab>
        <Tabs.Tab name="Albums" label="Albums">
          <TabScreen>
            <Albums />
          </TabScreen>
        </Tabs.Tab>
      </Screen.TabsBody>
    </Screen>
  )
}
