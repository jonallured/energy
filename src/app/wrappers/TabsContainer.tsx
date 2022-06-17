import { ReactElement } from "react"
import { Flex } from "palette"
import { Tabs, MaterialTabBar, TabBarProps } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TabName, TabReactElement } from "react-native-collapsible-tab-view/lib/typescript/types"

type TabsContainerProps = {
  header: (props: TabBarProps<TabName>) => ReactElement
  initialTabName: TabName | undefined
  children: TabReactElement<TabName> | TabReactElement<TabName>[]
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  header,
  children,
  initialTabName,
}) => {
  const insets = useSafeAreaInsets()
  return (
    <>
      <Flex flex={1} pt={insets.top}>
        <Tabs.Container
          renderHeader={header}
          headerContainerStyle={{
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
          }}
          initialTabName={initialTabName}
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
          {children}
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
