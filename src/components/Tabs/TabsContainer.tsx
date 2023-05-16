import { useColor, useSpace } from "@artsy/palette-mobile"
import { Tabs, MaterialTabBar, CollapsibleProps } from "react-native-collapsible-tab-view"

const TAB_BAR_HEIGHT = 50

export interface TabsContainerProps {
  renderHeader?: CollapsibleProps["renderHeader"]
  initialTabName?: CollapsibleProps["initialTabName"]
  children: CollapsibleProps["children"]
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  renderHeader,
  children,
  initialTabName,
}) => {
  const space = useSpace()
  const color = useColor()

  return (
    <Tabs.Container
      renderHeader={renderHeader}
      headerContainerStyle={{
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        backgroundColor: color("background"),
      }}
      initialTabName={initialTabName}
      containerStyle={{ paddingTop: space(2) }}
      renderTabBar={(props) => (
        <MaterialTabBar
          scrollEnabled
          {...props}
          style={{
            paddingHorizontal: space(1),
            marginBottom: space(2),
            height: TAB_BAR_HEIGHT,
          }}
          activeColor={color("onBackground")}
          inactiveColor={color("onBackgroundMedium")}
          labelStyle={{ marginTop: 0, marginHorizontal: -10 }} // removing the horizonal margin from the lib
          tabStyle={{ marginHorizontal: 10 }} // adding the margin back here
          indicatorStyle={{
            backgroundColor: color("onBackground"),
            height: 1,
          }}
        />
      )}
    >
      {children}
    </Tabs.Container>
  )
}
