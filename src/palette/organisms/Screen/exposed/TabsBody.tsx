import { ActivityIndicator } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
import { TabsContainer, TabsContainerProps } from "app/wrappers"
import { Body } from "./Body"

export const TabsBody = ({ children }: { children: TabsContainerProps["children"] }) => (
  <Body fullwidth>
    <TabsContainer>{children}</TabsContainer>
  </Body>
)

TabsBody.defaultProps = { __TYPE: "screen:tabs-body" }

export const PlaceholderTabsBody = () => (
  <Body fullwidth>
    <TabsContainer>
      <Tabs.Tab name="Loading" label="Works">
        <ActivityIndicator />
      </Tabs.Tab>
    </TabsContainer>
  </Body>
)
PlaceholderTabsBody.defaultProps = { __TYPE: "screen:placeholder:tabs-body" }
