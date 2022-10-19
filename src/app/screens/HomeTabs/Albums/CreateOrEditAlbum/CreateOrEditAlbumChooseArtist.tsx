import { Spacer } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { zip } from "lodash"
import { FlatList } from "react-native"
import { useLazyLoadQuery } from "react-relay"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { artistsQuery } from "app/screens/HomeTabs/Artists/Artists"
import { Header } from "app/sharedUI"
import { ArtistListItem } from "app/sharedUI/items/ArtistListItem"
import { GlobalStore } from "app/store/GlobalStore"
import { Touchable } from "palette"
import { extractNodes } from "shared/utils/extractNodes"

type CreateOrEditAlbumChooseArtistRoute = RouteProp<
  HomeTabsScreens,
  "CreateOrEditAlbumChooseArtist"
>

export const CreateOrEditAlbumChooseArtist = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const { mode, albumId } = useRoute<CreateOrEditAlbumChooseArtistRoute>().params
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
    <>
      <Header label={mode === "edit" ? "Save to Album" : "Add to Album"} safeAreaInsets />
      <Spacer mt={2} />
      <FlatList
        data={items}
        keyExtractor={(item, index) => item[0]?.internalID ?? `${index}`}
        renderItem={({ item: [artist, count] }) => (
          <Touchable
            onPress={() =>
              navigation.navigate("CreateOrEditAlbumChooseArtworks", {
                mode,
                albumId,
                slug: artist!.slug,
              })
            }
          >
            <ArtistListItem artist={artist!} count={count!} />
          </Touchable>
        )}
      />
    </>
  )
}
