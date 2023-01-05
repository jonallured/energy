import { Flex, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { zip } from "lodash"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ArtistListItem } from "app/components/Items/ArtistListItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsFlatList } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"

export const Artists = () => {
  const space = useSpace()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artistsData = useSystemQueryLoader<ArtistsQuery>(artistsQuery, { partnerID })
  const artists = extractNodes(artistsData.partner?.allArtistsConnection)
  const screenWidth = useWindowDimensions().width
  const counts = artistsData.partner?.allArtistsConnection?.edges?.map(
    (edge) => edge?.counts?.managedArtworks as string
  )
  if (!counts || !artists) {
    return null
  }
  const margin = 20
  const width = isTablet() ? (screenWidth - 2 * margin) / 2 : undefined

  const items = zip(artists, counts)

  return (
    <TabsFlatList
      data={items}
      numColumns={isTablet() ? 2 : 1}
      contentContainerStyle={{ paddingTop: space("1"), paddingBottom: space("1") }}
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
