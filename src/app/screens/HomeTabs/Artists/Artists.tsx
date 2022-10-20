import { Flex, Touchable } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { zip } from "lodash"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { ArtistListItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { TabsFlatList } from "app/wrappers"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"
import { extractNodes } from "shared/utils"

export const Artists = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artistsData = useLazyLoadQuery<ArtistsQuery>(artistsQuery, { partnerID })
  const artists = extractNodes(artistsData.partner?.allArtistsConnection)
  const counts = artistsData.partner?.allArtistsConnection?.edges?.map(
    (edge) => edge?.counts?.managedArtworks as string
  )
  if (!counts || !artists) {
    return null
  }
  const screenWidth = useWindowDimensions().width
  const margin = 20
  const width = isTablet() ? (screenWidth - 2 * margin) / 2 : undefined

  const items = zip(artists, counts)

  return (
    <TabsFlatList
      data={items}
      numColumns={isTablet() ? 2 : 1}
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
            style={{ width }}
          >
            <Flex mx={SCREEN_HORIZONTAL_PADDING}>
              <ArtistListItem artist={artist} count={count} />
            </Flex>
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
