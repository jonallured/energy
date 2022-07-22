import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { FlatList } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useLazyLoadQuery } from "react-relay"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { artistsQuery } from "app/screens/HomeTabs/Artists/Artists"
import { Header } from "app/sharedUI"
import { ArtistListItem } from "app/sharedUI/items/ArtistListItem"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex, Spacer, Touchable } from "palette"
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
  const insets = useSafeAreaInsets()

  return (
    <Flex flex={1} pt={insets.top}>
      <Header label={mode === "edit" ? "Save to Album" : "Add to Album"} />
      <Spacer mt={2} />
      <FlatList
        data={artists}
        renderItem={({ item: artist }) => (
          <Touchable
            onPress={() =>
              navigation.navigate("CreateOrEditAlbumChooseArtworks", {
                mode,
                albumId,
                slug: artist.slug,
              })
            }
          >
            <ArtistListItem artist={artist} />
          </Touchable>
        )}
        keyExtractor={(item) => item?.internalID!}
      />
    </Flex>
  )
}
