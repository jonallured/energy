import { SelectPartnerScreen } from "Screens/SelectPartner/SelectPartner"
import { GlobalStore } from "store/GlobalStore"
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view"
import { Flex, Text } from "palette"
import { Artists } from "Screens/Artists/Artists"
import { Shows } from "Screens/Shows/Shows"
import { Albums } from "Screens/Albums/Albums"

const Header = () => (
  <Flex px={2} pt={6}>
    <Text variant="lg">Folio</Text>
  </Flex>
)

export const HomeTabs = () => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  return (
    <Tabs.Container
      renderHeader={Header}
      headerContainerStyle={{
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      }}
      containerStyle={{ paddingTop: 20 }}
      TabBarComponent={(props) => (
        <MaterialTabBar
          scrollEnabled
          {...props}
          style={{ marginHorizontal: 10 }}
          labelStyle={{ margin: -10 }} // only way to match the design without patching the library
          tabStyle={{ margin: 10 }}
          indicatorStyle={{ backgroundColor: "black", width: "20%", height: 1 }}
        />
      )}
    >
      <Tabs.Tab name="Artists" label="Artists">
        <Artists />
      </Tabs.Tab>
      <Tabs.Tab name="Shows" label="Shows">
        <Shows />
      </Tabs.Tab>
      <Tabs.Tab name="Albums" label="Albums">
        <Albums />
      </Tabs.Tab>
    </Tabs.Container>
  )
}
