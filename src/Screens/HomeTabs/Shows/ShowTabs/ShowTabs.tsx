import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Flex, Text, Touchable, ArrowLeftIcon } from "palette"
import { Suspense } from "react"
import { ActivityIndicator } from "react-native"
import { TabsContainer } from "Screens/_helpers/TabsContainer"
import { TabBarProps, Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { HomeTabsScreens } from "routes/HomeTabsNavigationStack"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"
import { ShowArtworks } from "./ShowArtworks/ShowArtworks"
import { ShowInstalls } from "./ShowInstalls/ShowInstalls"

type ShowProps = NativeStackScreenProps<HomeTabsScreens, "ShowTabs">

type HeaderProps = {
  showName: string
  navigation: ShowProps["navigation"]
}

const Header: React.FC<TabBarProps & HeaderProps> = ({ showName, navigation }) => {
  return (
    <Flex px={2} mt={2}>
      <Touchable
        onPress={() => {
          navigation.goBack()
        }}
      >
        <ArrowLeftIcon fill="black100" />
      </Touchable>
      <Text variant="lg" mt={2}>
        {showName}
      </Text>
    </Flex>
  )
}

export const ShowTabs: React.FC<ShowProps> = ({ route, navigation }) => {
  const { slug } = route.params

  return (
    <Suspense
      fallback={
        <Flex justifyContent={"center"} flex={1}>
          <ActivityIndicator />
        </Flex>
      }
    >
      <RenderShow slug={slug} navigation={navigation} />
    </Suspense>
  )
}

type RenderShowProps = {
  slug: string
  navigation: ShowProps["navigation"]
}

const RenderShow: React.FC<RenderShowProps> = ({ slug, navigation }) => {
  const data = useLazyLoadQuery<ShowTabsQuery>(
    graphql`
      query ShowTabsQuery($slug: String!) {
        show(id: $slug) {
          name
        }
      }
    `,
    { slug }
  )

  return (
    <TabsContainer
      header={(props) => <Header showName={data.show?.name!} navigation={navigation} {...props} />}
    >
      <Tabs.Tab name="ShowArtworks" label="Works">
        <ShowArtworks slug={slug} />
      </Tabs.Tab>
      <Tabs.Tab name="ShowInstalls" label="Shows">
        <ShowInstalls />
      </Tabs.Tab>
    </TabsContainer>
  )
}
