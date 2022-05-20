import { SelectPartnerScreen } from "Screens/SelectPartner/SelectPartner"
import { GlobalStore } from "store/GlobalStore"
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view"
import { Flex, Text } from "palette"
import { Suspense } from "react"
import { TabsFlatList } from "helpers/components/TabsWrapper"
import { ActivityIndicator } from "react-native"
import { Shows } from "./Shows/Shows"
import { Albums } from "./Albums/Albums"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Artists } from "Screens/HomeTabs/Artists/Artists"

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
            <Suspense
              fallback={<TabsFlatList data={[0]} renderItem={() => <ActivityIndicator />} />}
            >
              <Artists />
            </Suspense>
          </Tabs.Tab>
          <Tabs.Tab name="Shows" label="Shows">
            <Suspense
              fallback={<TabsFlatList data={[0]} renderItem={() => <ActivityIndicator />} />}
            >
              <Shows />
            </Suspense>
          </Tabs.Tab>
          <Tabs.Tab name="Albums" label="Albums">
            <Suspense
              fallback={<TabsFlatList data={[0]} renderItem={() => <ActivityIndicator />} />}
            >
              <Albums />
            </Suspense>
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
