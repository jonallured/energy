import { Screen, useSpace } from "@artsy/palette-mobile"
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistsList } from "components/Lists/ArtistsList"
import { useTrackScreen } from "system/hooks/useTrackScreen"

type CreateOrEditAlbumChooseArtistRoute = RouteProp<
  NavigationScreens,
  "CreateOrEditAlbumChooseArtist"
>

export const CreateOrEditAlbumChooseArtist = () => {
  // TODO: is edit: Album / is new Artist
  useTrackScreen({ name: "CreateOrEditAlbumChooseArtist", type: "Artist" })

  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { mode, albumId } =
    useRoute<CreateOrEditAlbumChooseArtistRoute>().params
  const space = useSpace()

  const handleItemPress = (item: ArtistListItem_artist$data) => {
    navigation.navigate("CreateOrEditAlbumChooseArtworks", {
      mode,
      albumId,
      slug: item.slug,
    })
  }

  return (
    <Screen>
      <Screen.Header
        title={mode === "edit" ? "Save to Album" : "Add to Album"}
        onBack={navigation.goBack}
      />
      <Screen.Body>
        <ArtistsList
          onItemPress={handleItemPress}
          contentContainerStyle={{ marginVertical: space(1) }}
          isInTabs={false}
        />
      </Screen.Body>
    </Screen>
  )
}
