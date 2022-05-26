import { FlatList, ScrollView, SectionList } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"

// When testing with react-native-collapsible-tab-view and reanimated,
// we had problems making the tests run in jest.
// For that reason, when we use these components in the app,
// we use the regular `Tabs` variants, coming from collapsible-tab-view,
// and when we test, we use the react-native variants, to avoid the issues.
// That means that when testing these components, we actually test the content
// inside the tab, and not the tab navigation part.

export const TabsFlatList = __TEST__ ? FlatList : Tabs.FlatList
export const TabsScrollView = __TEST__ ? ScrollView : Tabs.ScrollView
export const TabsSectionList = __TEST__ ? SectionList : Tabs.SectionList
