import { SelectPartnerScreen } from "Screens/SelectPartner/SelectPartner"
import { GlobalStore } from "store/GlobalStore"
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view"
import { Flex, Text } from "palette"
import { ArtistsScreen } from "Screens/Artists/Artists"
import { Shows } from "./Shows/Shows"
import { Albums } from "./Albums/Albums"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const Header = () => (
  <Flex px={2} mt={2}>
    <Text variant="lg">Folio</Text>
  </Flex>
)

export const HomeTabs = () => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)

  const insets = useSafeAreaInsets()

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  return (
    <>
      <Flex flex={1} pt={insets.top}>
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
            <ArtistsScreen />
          </Tabs.Tab>
          <Tabs.Tab name="Shows" label="Shows">
            <Shows />
          </Tabs.Tab>
          <Tabs.Tab name="Albums" label="Albums">
            <Albums />
          </Tabs.Tab>
        </Tabs.Container>
      </Flex>
      <Flex
        height={insets.top}
        backgroundColor={"white100"}
        position={"absolute"}
        top={0}
        left={0}
        right={0}
      />
    </>
  )
}
