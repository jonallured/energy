import { NavigationProp, useNavigation } from "@react-navigation/native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { ArtistListItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { TabsFlatList } from "app/wrappers"
import { Touchable } from "palette"
import { extractNodes } from "shared/utils"

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
          onPress={() =>
            navigation.navigate("ArtistTabs", {
              slug: artist.slug,
            })
          }
        >
          <ArtistListItem artist={artist} />
        </Touchable>
      )}
      ListEmptyComponent={<ListEmptyComponent text="No artists" />}
      keyExtractor={(item) => item?.internalID}
    />
  )
}

export const artistsQuery = graphql`
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
