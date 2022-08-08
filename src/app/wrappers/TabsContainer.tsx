import { ReactElement } from "react"
import { Tabs, MaterialTabBar, TabBarProps } from "react-native-collapsible-tab-view"
import { TabName, TabReactElement } from "react-native-collapsible-tab-view/lib/typescript/types"
import { Flex, useSpace } from "palette"

type TabsContainerProps = {
  header: (props: TabBarProps<TabName>) => ReactElement
  initialTabName?: TabName
  children: TabReactElement<TabName> | TabReactElement<TabName>[]
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  header,
  children,
  initialTabName,
}) => {
  const space = useSpace()

  return (
    <>
      <Tabs.Container
        renderHeader={header}
        headerContainerStyle={{
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        }}
        initialTabName={initialTabName}
        containerStyle={{ paddingTop: space(2) }}
        TabBarComponent={(props) => (
          <MaterialTabBar
            scrollEnabled
            {...props}
            style={{ marginHorizontal: space(1) }}
            labelStyle={{ margin: -space(1) }} // only way to match the design without patching the library
            tabStyle={{ margin: space(1) }}
            indicatorStyle={{ backgroundColor: "black", width: "20%", height: 1 }}
          />
        )}
      >
        {children}
      </Tabs.Container>
      <Flex backgroundColor={"white100"} position={"absolute"} top={0} left={0} right={0} />
    </>
  )
}
