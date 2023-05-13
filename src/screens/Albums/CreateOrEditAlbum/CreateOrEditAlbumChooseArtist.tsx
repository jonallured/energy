import { Screen } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistsList } from "components/Lists/ArtistsList"

type CreateOrEditAlbumChooseArtistRoute = RouteProp<
  NavigationScreens,
  "CreateOrEditAlbumChooseArtist"
>

export const CreateOrEditAlbumChooseArtist = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { mode, albumId } = useRoute<CreateOrEditAlbumChooseArtistRoute>().params

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
        <ArtistsList onItemPress={handleItemPress} contentContainerStyle={{}} />
      </Screen.Body>
    </Screen>
  )
}
