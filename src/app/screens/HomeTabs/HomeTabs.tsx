import { GlobalStore } from "app/store/GlobalStore"
import { Tabs } from "react-native-collapsible-tab-view"
import { Flex, Text } from "palette"
import { TabsContainer } from "app/wrappers"
import { Shows } from "./Shows/Shows"
import { Albums } from "./Albums/Albums"
import { SelectPartnerScreen } from "app/screens/Auth/SelectPartner"
import { Artists } from "./Artists/Artists"
import { RouteProp, useRoute } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"

const Header = () => (
  <Flex px={2} mt={2}>
    <Text variant="lg">Folio</Text>
  </Flex>
)

type HomeTabsRoute = RouteProp<HomeTabsScreens, "HomeTabs">

export const HomeTabs = () => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)
  const { tabName } = useRoute<HomeTabsRoute>().params || { tabName: "Artists" }

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  return (
    <TabsContainer header={Header} initialTabName={tabName}>
      <Tabs.Tab name="Artists" label="Artists">
        <Artists />
      </Tabs.Tab>
      <Tabs.Tab name="Shows" label="Shows">
        <Shows />
      </Tabs.Tab>
      <Tabs.Tab name="Albums" label="Albums">
        <Albums />
      </Tabs.Tab>
    </TabsContainer>
  )
}
