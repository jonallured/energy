import { ReactElement } from "react"
import { Flex, useColor, useSpace } from "palette"
import { Tabs, MaterialTabBar, TabBarProps } from "react-native-collapsible-tab-view"
import { TabName, TabReactElement } from "react-native-collapsible-tab-view/lib/typescript/types"
import { useSafeAreaInsets } from "react-native-safe-area-context"

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
  const color = useColor()
  const insets = useSafeAreaInsets()

  return (
    <>
      <Tabs.Container
        renderHeader={header}
        headerContainerStyle={{
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          backgroundColor: color("background"),
        }}
        initialTabName={initialTabName}
        containerStyle={{ paddingTop: space(2) }}
        TabBarComponent={(props) => (
          <MaterialTabBar
            scrollEnabled
            {...props}
            style={{ marginHorizontal: space(1) }}
            activeColor={color("onBackgroundHigh")}
            inactiveColor={color("onBackgroundMedium")}
            labelStyle={{ margin: -space(1) }} // only way to match the design without patching the library
            tabStyle={{ margin: space(1) }}
            indicatorStyle={{ backgroundColor: color("onBackgroundHigh"), width: "20%", height: 1 }}
          />
        )}
      >
        {children}
      </Tabs.Container>
      <Flex
        height={insets.top}
        backgroundColor="background"
        position="absolute"
        top={0}
        left={0}
        right={0}
      />
    </>
  )
}
