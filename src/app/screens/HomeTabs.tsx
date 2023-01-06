import { MenuIcon, Touchable, MagnifyingGlassIcon, DEFAULT_HIT_SLOP } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Tabs } from "react-native-collapsible-tab-view"
import { NavigationScreens } from "app/Navigation"
import { TabScreen } from "app/components/Tabs/TabScreen"
import { useSetupRageShake } from "app/system/devTools/useSetupRageShake"
import { GlobalStore } from "app/system/store/GlobalStore"
import { Screen } from "palette"
import { Albums } from "./Albums/Albums"
import { Artists } from "./Artists/Artists"
import { Shows } from "./Shows/Shows"

type HomeTabsRoute = RouteProp<NavigationScreens, "HomeTabs">

export const HomeTabs = () => {
  const isOnline = GlobalStore.useAppState((state) => state.networkStatus.isOnline)
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
