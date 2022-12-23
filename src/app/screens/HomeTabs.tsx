import { MenuIcon, Touchable, MagnifyingGlassIcon } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Tabs } from "react-native-collapsible-tab-view"
import { NavigationScreens } from "app/Navigation"
import { useSetupRageShake } from "app/system/devTools/useSetupRageShake"
import { GlobalStore } from "app/system/store/GlobalStore"
import { ErrorBoundary } from "app/system/wrappers/ErrorBoundary"
import { SuspenseWrapper } from "app/system/wrappers/SuspenseWrapper"
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
          <Touchable
            hitSlop={{
              top: 10,
              left: 10,
              bottom: 10,
              right: 10,
            }}
            onPress={() => navigation.navigate("Settings")}
          >
            <MenuIcon fill="onBackgroundHigh" />
          </Touchable>
        }
        rightElements={
          <>
            {isOnline && (
              <Touchable onPress={() => navigation.navigate("Search")}>
                <MagnifyingGlassIcon fill="onBackgroundHigh" />
              </Touchable>
            )}
          </>
        }
      />
      <Screen.TabsBody initialTabName={tabName}>
        <Tabs.Tab name="Artists" label="Artists">
          <ErrorBoundary withoutBackButton>
            <SuspenseWrapper withTabs>
              <Artists />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Tabs.Tab>
        <Tabs.Tab name="Shows" label="Shows">
          <ErrorBoundary withoutBackButton>
            <SuspenseWrapper withTabs>
              <Shows />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Tabs.Tab>
        <Tabs.Tab name="Albums" label="Albums">
          <ErrorBoundary withoutBackButton>
            <SuspenseWrapper withTabs>
              <Albums />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Tabs.Tab>
      </Screen.TabsBody>
    </Screen>
  )
}