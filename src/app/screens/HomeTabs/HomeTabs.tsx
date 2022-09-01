import { Albums } from "./Albums/Albums"
import { Artists } from "./Artists/Artists"
import { MenuIcon, Touchable } from "palette"
import { GlobalStore } from "app/store/GlobalStore"
import { Header } from "app/sharedUI"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { SelectPartnerScreen } from "app/screens/Auth/SelectPartner"
import { Shows } from "./Shows/Shows"
import { SuspenseWrapper, TabsContainer } from "app/wrappers"
import { Tabs } from "react-native-collapsible-tab-view"

type HomeTabsRoute = RouteProp<HomeTabsScreens, "HomeTabs">

export const HomeTabs = () => {
  const navigation = useNavigation()
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)
  const { tabName } = useRoute<HomeTabsRoute>().params || { tabName: "Artists" }

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  return (
    <TabsContainer
      header={(props) => (
        <Header
          {...props}
          withoutBackButton
          leftElements={
            <Touchable onPress={() => navigation.navigate("Settings")}>
              <MenuIcon fill="onBackgroundHigh" />
            </Touchable>
          }
          rightElements={
            <Touchable onPress={() => navigation.navigate("FolioDesignLanguage")}>
              <MenuIcon fill="onBackgroundHigh" />
            </Touchable>
          }
          label="Folio"
        />
      )}
      initialTabName={tabName}
    >
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
    </TabsContainer>
  )
}
