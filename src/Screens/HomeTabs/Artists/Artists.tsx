import { Touchable } from "palette"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { GlobalStore } from "store/GlobalStore"
import { extractNodes } from "shared/utils/extractNodes"
import { TabsFlatList } from "Screens/_helpers/TabsTestWrappers"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "routes/HomeTabsNavigationStack"
import { ArtistListItem } from "Screens/_shared/ArtistListItem"

export const Artists = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artistsData = useLazyLoadQuery<ArtistsQuery>(artistsQuery, { partnerID })
  const artists = extractNodes(artistsData.partner?.allArtistsConnection)

  return (
    <TabsFlatList
      data={artists}
      renderItem={({ item: artist }) => (
        <Touchable
          onPress={() => {
            navigation.navigate("ArtistTabs", {
              slug: artist.slug || "",
            })
          }}
        >
          <ArtistListItem artist={artist} />
        </Touchable>
      )}
      keyExtractor={(item) => item?.internalID!}
    />
  )
}

const artistsQuery = graphql`
  query ArtistsQuery($partnerID: String!) {
    partner(id: $partnerID) {
      allArtistsConnection {
        totalCount
        edges {
          node {
            slug
            internalID
            ...ArtistListItem_artist
          }
        }
      }
    }
  }
`
