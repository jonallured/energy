import { Flex, Tabs, useScreenDimensions } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationRoutes } from "Navigation"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"

import { SelectModeActions } from "components/SelectMode/SelectModeActions"
import { TabsView } from "components/TabsView"
import { ActivityIndicator } from "react-native"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { TabScreen } from "system/wrappers/TabScreen"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"
import { ShowArtworks } from "./ShowArtworks"
import { ShowDocuments } from "./ShowDocuments"
import { ShowInstalls } from "./ShowInstalls"

type ShowTabsRoute = RouteProp<NavigationRoutes, "ArtistTabs">

export const ShowTabs = () => {
  const { slug } = useRoute<ShowTabsRoute>().params
  const { data } = useSystemQueryLoader<ShowTabsQuery>(showTabsQuery, { slug })

  return (
    <>
      <SelectModeActions />

      <TabsView title={data.show?.name!}>
        <Tabs.Tab name="ShowArtworks" label="Works">
          <TabScreen>
            <ShowArtworks slug={slug} />
          </TabScreen>
        </Tabs.Tab>
        <Tabs.Tab name="ShowInstalls" label="Installs">
          <TabScreen>
            <ShowInstalls slug={slug} />
          </TabScreen>
        </Tabs.Tab>
        <Tabs.Tab name="ShowDocuments" label="Documents">
          <TabScreen>
            <ShowDocuments slug={slug} />
          </TabScreen>
        </Tabs.Tab>
      </TabsView>
    </>
  )
}

export const showTabsQuery = graphql`
  query ShowTabsQuery($slug: String!) {
    show(id: $slug, includeAllShows: true) {
      name
      artworksConnection(first: 99) {
        edges {
          node {
            ...Artwork_artworkProps @relay(mask: false)
          }
        }
      }
    }
  }
`

export const SkeletonShowTabs = () => {
  const dimensions = useScreenDimensions()
  const isDarkMode = useIsDarkMode()

  return (
    <TabsView
      title={
        <Flex alignItems="center" width={dimensions.width} pr={4}>
          <ActivityIndicator color={isDarkMode ? "white" : "black"} />
        </Flex>
      }
    >
      <Tabs.Tab name="ShowArtworks" label="Works">
        <></>
      </Tabs.Tab>
      <Tabs.Tab name="ShowInstalls" label="Installs">
        <></>
      </Tabs.Tab>
      <Tabs.Tab name="ShowDocuments" label="Documents">
        <></>
      </Tabs.Tab>
    </TabsView>
  )
}
