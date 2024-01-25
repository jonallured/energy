import { Tabs } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"

import { TabsView } from "components/TabsView"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { TabScreen } from "system/wrappers/TabScreen"
import { ShowArtworks } from "./ShowArtworks"
import { ShowDocuments } from "./ShowDocuments"
import { ShowInstalls } from "./ShowInstalls"

type ShowTabsRoute = RouteProp<NavigationScreens, "ArtistTabs">

export const ShowTabs = () => {
  const { slug } = useRoute<ShowTabsRoute>().params
  const { data } = useSystemQueryLoader<ShowTabsQuery>(showTabsQuery, { slug })

  return (
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
  return (
    <TabsView title="">
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
