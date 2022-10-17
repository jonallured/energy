import { ActivityIndicator } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
import { TabsContainer, TabsContainerProps } from "app/wrappers"
import { Body } from "./Body"
import { LargeTitle } from "./LargeTitle"

export const AnimatedTitleTabsBody = ({
  children,
}: {
  children: TabsContainerProps["children"]
}) => (
  <Body fullwidth>
    <TabsContainer header={() => <LargeTitle />}>{children}</TabsContainer>
  </Body>
)

AnimatedTitleTabsBody.defaultProps = { __TYPE: "screen:animated-title-tabs-body" }

export const PlaceholderAnimatedTitleTabsBody = () => (
  <Body fullwidth>
    <TabsContainer header={() => <LargeTitle />}>
      <Tabs.Tab name="Loading" label="Works">
        <ActivityIndicator />
      </Tabs.Tab>
    </TabsContainer>
  </Body>
)
PlaceholderAnimatedTitleTabsBody.defaultProps = {
  __TYPE: "screen:placeholder:animated-title-tabs-body",
}
