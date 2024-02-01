import {
  MenuIcon,
  Touchable,
  MagnifyingGlassIcon,
  DEFAULT_HIT_SLOP,
  Tabs,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { TabsView } from "components/TabsView"
import { useSetupRageShake } from "system/devTools/useSetupRageShake"
import { TabScreen } from "system/wrappers/TabScreen"
import { useIsOnline } from "utils/hooks/useIsOnline"
import { Albums } from "./Albums/Albums"
import { Artists } from "./Artists/Artists"
import { Shows } from "./Shows/Shows"

export const HomeTabs = () => {
  const isOnline = useIsOnline()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()

  useSetupRageShake()

  return (
    <TabsView
      title="Folio"
      showLargeHeaderText={false}
      headerProps={{
        animated: false,
        leftElements: (
          <Touchable
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => navigation.navigate("Settings")}
          >
            <MenuIcon fill="onBackgroundHigh" top="1px" />
          </Touchable>
        ),
        rightElements: (
          <>
            {!!isOnline && (
              <Touchable
                onPress={() => navigation.navigate("Search")}
                hitSlop={DEFAULT_HIT_SLOP}
              >
                <MagnifyingGlassIcon fill="onBackgroundHigh" top="4px" />
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
    </TabsView>
  )
}
