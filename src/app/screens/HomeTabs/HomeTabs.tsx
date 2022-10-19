import { MenuIcon, Touchable } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Tabs } from "react-native-collapsible-tab-view"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { SelectPartnerScreen } from "app/screens/Auth/SelectPartner"
import { GlobalStore } from "app/store/GlobalStore"
import { SuspenseWrapper } from "app/wrappers"
import { Screen } from "palette"
import { Albums } from "./Albums/Albums"
import { Artists } from "./Artists/Artists"
import { Shows } from "./Shows/Shows"

type HomeTabsRoute = RouteProp<HomeTabsScreens, "HomeTabs">

export const HomeTabs = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)
  const { tabName } = useRoute<HomeTabsRoute>().params || { tabName: "Artists" }

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

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
          <Touchable onPress={() => navigation.navigate("FolioDesignLanguage")}>
            <MenuIcon fill="onBackgroundHigh" />
          </Touchable>
        }
      />
      <Screen.TabsBody initialTabName={tabName}>
        <Tabs.Tab name="Artists" label="Artists">
          <SuspenseWrapper withTabs>
            <Artists />
          </SuspenseWrapper>
        </Tabs.Tab>
        <Tabs.Tab name="Shows" label="Shows">
          <SuspenseWrapper withTabs>
            <Shows />
          </SuspenseWrapper>
        </Tabs.Tab>
        <Tabs.Tab name="Albums" label="Albums">
          <SuspenseWrapper withTabs>
            <Albums />
          </SuspenseWrapper>
        </Tabs.Tab>
      </Screen.TabsBody>
    </Screen>
  )
}
