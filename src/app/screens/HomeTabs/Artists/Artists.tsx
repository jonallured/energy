import { NavigationProp, useNavigation } from "@react-navigation/native"
import { zip } from "lodash"
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
  const counts = artistsData.partner?.allArtistsConnection?.edges?.map(
    (edge) => edge?.counts?.managedArtworks as string
  )
  if (!counts || !artists) {
    return null
  }

  const items = zip(artists, counts)

  return (
    <TabsFlatList
      data={items}
      renderItem={({ item }) => {
        const artist = item[0]!
        const count = item[1]!
        return (
          <Touchable
            onPress={() =>
              navigation.navigate("ArtistTabs", {
                slug: artist.slug,
                name: artist.name!,
              })
            }
          >
            <ArtistListItem artist={artist} count={count} />
          </Touchable>
        )
      }}
      ListEmptyComponent={<ListEmptyComponent text="No artists" />}
      keyExtractor={(item) => {
        const artist = item[0]!
        return artist.internalID
      }}
    />
  )
}

export const artistsQuery = graphql`
  query ArtistsQuery($partnerID: String!) {
    partner(id: $partnerID) {
      allArtistsConnection(includeAllFields: true) {
        totalCount
        edges {
          counts {
            managedArtworks
          }
          node {
            name
            slug
            internalID
            ...ArtistListItem_artist
          }
        }
      }
    }
  }
`
