import { Tabs, MaterialTabBar, CollapsibleProps } from "react-native-collapsible-tab-view"
import { useColor, useSpace } from "palette"

const TAB_BAR_HEIGHT = 60

export type TabsContainerProps = {
  header?: CollapsibleProps["renderHeader"]
  initialTabName?: CollapsibleProps["initialTabName"]
  children: CollapsibleProps["children"]
}

export const TabsContainer = ({ header, children, initialTabName }: TabsContainerProps) => {
  const space = useSpace()
  const color = useColor()

  return (
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
      renderTabBar={(props) => (
        <MaterialTabBar
          scrollEnabled
          {...props}
          style={{ paddingHorizontal: space(1), height: TAB_BAR_HEIGHT }}
          activeColor={color("onBackground")}
          inactiveColor={color("onBackgroundMedium")}
          labelStyle={{ marginTop: -5, marginHorizontal: -10 }} // removing the horizonal margin from the lib
          tabStyle={{ marginHorizontal: 10 }} // adding the margin back here
          indicatorStyle={{
            backgroundColor: color("onBackground"),
            height: 1,
            marginBottom: 10,
          }}
        />
      )}
    >
      {children}
    </Tabs.Container>
  )
}
