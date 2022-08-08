import { RouteProp, useRoute } from "@react-navigation/native"
import { Tabs } from "react-native-collapsible-tab-view"
import { Albums } from "./Albums/Albums"
import { Artists } from "./Artists/Artists"
import { Shows } from "./Shows/Shows"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { SelectPartnerScreen } from "app/screens/Auth/SelectPartner"
import { GlobalStore } from "app/store/GlobalStore"
import { SuspenseWrapper, TabsContainer } from "app/wrappers"
import { useNavigation } from "@react-navigation/native"
import { Flex, Text, Touchable, MenuIcon } from "palette"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type HomeTabsRoute = RouteProp<HomeTabsScreens, "HomeTabs">

export const Header = () => {
  const navigation = useNavigation()
  const safeAreaInsets = useSafeAreaInsets()

  return (
    <Flex flexDirection="row" px={2} mt={2} alignItems="center" pt={safeAreaInsets.top}>
      <Touchable
        onPress={() => {
          navigation.navigate("Settings")
        }}
      >
        <MenuIcon />
      </Touchable>
      <Flex flex={1} ml={1}>
        <Text variant="lg">Folio</Text>
      </Flex>
    </Flex>
  )
}

export const HomeTabs = () => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)
  const { tabName } = useRoute<HomeTabsRoute>().params || { tabName: "Artists" }

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  return (
    <TabsContainer header={() => <Header />} initialTabName={tabName}>
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
