import { Flex, Text } from "palette"
import * as React from "react"
import { StyleSheet } from "react-native"
import { TabView, TabBar, SceneMap, NavigationState, SceneRendererProps } from "react-native-tab-view"
// import Article from "./Shared/Article"
// import Albums from "./Shared/Albums"
// import Chat from "./Shared/Chat"
// import Contacts from "./Shared/Contacts"

const Article = () => (
  <Flex
    backgroundColor={"orange"}
    flex={1} //p={4}
  >
    <Text variant="xl">Aaaartistsssss</Text>
    <Text>Aaaartistsssss</Text>
    <Text>Aaaartistsssss</Text>
  </Flex>
)
const Albums = () => (
  <Flex
    backgroundColor={"orange"}
    flex={1} //p={4}
  >
    <Text variant="xl">Albums</Text>
    <Text>Albums</Text>
  </Flex>
)
const Chat = () => (
  <Flex
    backgroundColor={"orange"}
    flex={1} //p={4}
  >
    <Text variant="xl">Chat</Text>
    <Text>Chat</Text>
  </Flex>
)
const Contacts = () => (
  <Flex
    backgroundColor={"orange"}
    flex={1} //p={4}
  >
    <Text variant="xl">Contacts</Text>
    <Text>Contacts</Text>
    <Text>Contacts</Text>
    <Text>Contacts</Text>
    <Text>Contacts</Text>
  </Flex>
)

type State = NavigationState<{
  key: string
  title: string
}>

export default class ScrollableTabBarExample extends React.Component<{}, State> {
  // eslint-disable-next-line react/sort-comp
  static title = "Scrollable tab bar"
  static backgroundColor = "#3f51b5"
  static appbarElevation = 0

  state = {
    index: 1,
    routes: [
      { key: "article", title: "Article" },
      { key: "contacts", title: "Contacts" },
      { key: "albums", title: "Albums" },
      { key: "chat", title: "Chat" },
    ],
  }

  private handleIndexChange = (index: number) =>
    this.setState({
      index,
    })

  private renderTabBar = (props: SceneRendererProps & { navigationState: State }) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  )

  private renderScene = SceneMap({
    albums: Albums,
    contacts: Contacts,
    article: Article,
    chat: Chat,
  })

  render() {
    return (
      <TabView
        lazy
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        onIndexChange={this.handleIndexChange}
      />
    )
  }
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: "#3f51b5",
  },
  tab: {
    width: 120,
  },
  indicator: {
    backgroundColor: "#ffeb3b",
  },
  label: {
    fontWeight: "400",
  },
})
