import { Flex, Text, Touchable, ArrowLeftIcon } from "palette"
import { TabsContainer } from "app/wrappers/TabsContainer"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"
import { ShowArtworks } from "./ShowArtworks/ShowArtworks"
import { ShowInstalls } from "./ShowInstalls/ShowInstalls"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { SuspenseWrapper } from "app/wrappers/SuspenseWrapper"

type HeaderProps = {
  showName: string
}

const Header = ({ showName }: HeaderProps) => {
  const navigation = useNavigation()
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

type ShowTabsRoute = RouteProp<HomeTabsScreens, "ArtistTabs">

export const ShowTabs = () => {
  const { slug } = useRoute<ShowTabsRoute>().params

  return (
    <SuspenseWrapper>
      <RenderShow slug={slug} />
    </SuspenseWrapper>
  )
}

type RenderShowProps = {
  slug: string
}

const RenderShow: React.FC<RenderShowProps> = ({ slug }) => {
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
    <TabsContainer header={(props) => <Header showName={data.show?.name!} {...props} />}>
      <Tabs.Tab name="ShowArtworks" label="Works">
        <ShowArtworks slug={slug} />
      </Tabs.Tab>
      <Tabs.Tab name="ShowInstalls" label="Shows">
        <ShowInstalls />
      </Tabs.Tab>
    </TabsContainer>
  )
}
