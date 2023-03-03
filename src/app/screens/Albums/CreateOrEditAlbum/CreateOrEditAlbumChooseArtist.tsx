import { Touchable } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ArtistListItem } from "app/components/Items/ArtistListItem"
import { artistsQuery } from "app/screens/Artists/Artists"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { zip } from "lodash"
import { Screen } from "palette"
import { useCallback } from "react"
import { FlatList } from "react-native"

type CreateOrEditAlbumChooseArtistRoute = RouteProp<
  NavigationScreens,
  "CreateOrEditAlbumChooseArtist"
>

export const CreateOrEditAlbumChooseArtist = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { mode, albumId } = useRoute<CreateOrEditAlbumChooseArtistRoute>().params
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const artistsData = useSystemQueryLoader<ArtistsQuery>(artistsQuery, { partnerID })
  const artists = extractNodes(artistsData.partner?.allArtistsConnection)
  const counts =
    artistsData.partner?.allArtistsConnection?.edges?.map(
      (edge) => edge?.counts?.managedArtworks as string
    ) ?? []

  const items = zip(artists, counts)

  const renderItem = useCallback(
    ({ item: [artist, count] }) => (
      <Touchable
        onPress={() =>
          navigation.navigate("CreateOrEditAlbumChooseArtworks", {
            mode,
            albumId,
            slug: artist.slug,
          })
        }
      >
        <ArtistListItem artist={artist} count={count} />
      </Touchable>
    ),
    []
  )

  if (!counts || !artists) {
    return null
  }

  return (
    <Screen>
      <Screen.Header title={mode === "edit" ? "Save to Album" : "Add to Album"} />
      <Screen.Body>
        <FlatList
          data={items}
          keyExtractor={(item, index) => item[0]?.internalID ?? `${index}`}
          renderItem={renderItem}
          removeClippedSubviews
          windowSize={5}
        />
      </Screen.Body>
    </Screen>
  )
}
