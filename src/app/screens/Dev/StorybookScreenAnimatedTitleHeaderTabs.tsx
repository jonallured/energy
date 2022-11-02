import { Text } from "@artsy/palette-mobile"
import { range } from "lodash"
import { Tabs } from "react-native-collapsible-tab-view"
import { TabsFlatList, TabsScrollView } from "app/wrappers"
import { Screen } from "palette"

export function StorybookScreenAnimatedTitleHeaderTabs() {
  return (
    <Screen>
      <Screen.AnimatedTitleHeader title="cool title" />

      <Screen.AnimatedTitleTabsBody>
        <Tabs.Tab name="first" label="First">
          <TabsScrollView>
            {range(10).map((x) =>
              x % 5 !== 0 ? (
                <Text key={`${x}`}>first tab wow content {x}</Text>
              ) : (
                <Text key={`${x}`}>scroll up for some cool stuff to happen</Text>
              )
            )}
          </TabsScrollView>
        </Tabs.Tab>

        <Tabs.Tab name="second">
          <TabsFlatList
            data={range(200)}
            renderItem={({ index }) => <Text key={`${index}`}>second tab wow content {index}</Text>}
          />
        </Tabs.Tab>
      </Screen.AnimatedTitleTabsBody>
    </Screen>
  )
}
