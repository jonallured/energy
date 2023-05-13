import { MenuIcon, Touchable, MagnifyingGlassIcon, DEFAULT_HIT_SLOP } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { TabScreen } from "components/Tabs/TabScreen"
import { TabsWithHeader } from "components/Tabs/TabsWithHeader"
import { Tabs } from "react-native-collapsible-tab-view"
import { useSetupRageShake } from "system/devTools/useSetupRageShake"
import { useIsOnline } from "utils/hooks/useIsOnline"
import { Albums } from "./Albums/Albums"
import { Artists } from "./Artists/Artists"
import { Shows } from "./Shows/Shows"

export const HomeTabs = () => {
  const isOnline = useIsOnline()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()

  useSetupRageShake()

  return (
    <TabsWithHeader
      title="Folio"
      showHeader={false}
      headerProps={{
        animated: false,
        leftElements: (
          <Touchable hitSlop={DEFAULT_HIT_SLOP} onPress={() => navigation.navigate("Settings")}>
            <MenuIcon fill="onBackgroundHigh" top="1px" />
          </Touchable>
        ),
        rightElements: (
          <>
            {!!isOnline && (
              <Touchable onPress={() => navigation.navigate("Search")} hitSlop={DEFAULT_HIT_SLOP}>
                <MagnifyingGlassIcon fill="onBackgroundHigh" />
              </Touchable>
            )}
          </>
        ),
      }}
    >
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
    </TabsWithHeader>
  )
}
