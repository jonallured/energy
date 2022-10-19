import { range } from "lodash"
import { Tabs } from "react-native-collapsible-tab-view"
import { TabsFlatList, TabsScrollView } from "app/wrappers"
import { Screen, Text } from "palette"

export const StorybookScreenAnimatedTitleHeaderTabs = () => (
  <Screen>
    <Screen.AnimatedTitleHeader title="cool title" />

    <Screen.AnimatedTitleTabsBody>
      <Tabs.Tab name="first" label="First">
        <TabsScrollView>
          {range(10).map((x) =>
            x % 5 !== 0 ? (
              <Text>first tab wow content {x}</Text>
            ) : (
              <Text>scroll up for some cool stuff to happen</Text>
            )
          )}
        </TabsScrollView>
      </Tabs.Tab>

      <Tabs.Tab name="second">
        <TabsFlatList
          data={range(20)}
          renderItem={({ index }) => <Text>second tab wow content {index}</Text>}
        />
      </Tabs.Tab>
    </Screen.AnimatedTitleTabsBody>
  </Screen>
)
