import { RouteProp, useRoute } from "@react-navigation/native"
import { Tabs } from "react-native-collapsible-tab-view"
import { Albums } from "./Albums/Albums"
import { Artists } from "./Artists/Artists"
import { Shows } from "./Shows/Shows"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { SelectPartnerScreen } from "app/screens/Auth/SelectPartner"
import { Header } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { SuspenseWrapper, TabsContainer } from "app/wrappers"

type HomeTabsRoute = RouteProp<HomeTabsScreens, "HomeTabs">

export const HomeTabs = () => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)
  const { tabName } = useRoute<HomeTabsRoute>().params || { tabName: "Artists" }

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  return (
    <TabsContainer
      header={(props) => <Header {...props} label="Folio" withoutBackButton />}
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
