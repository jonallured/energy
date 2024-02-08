import { Screen, useSpace } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationRoutes } from "Navigation"
import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistsList } from "components/Lists/ArtistsList"
import { useRouter } from "system/hooks/useRouter"
import { useTrackScreen } from "system/hooks/useTrackScreen"

type CreateOrEditAlbumChooseArtistRoute = RouteProp<
  NavigationRoutes,
  "CreateOrEditAlbumChooseArtist"
>

export const CreateOrEditAlbumChooseArtist = () => {
  // TODO: is edit: Album / is new Artist
  useTrackScreen({ name: "CreateOrEditAlbumChooseArtist", type: "Artist" })

  const { router } = useRouter()
  const { mode, albumId } =
    useRoute<CreateOrEditAlbumChooseArtistRoute>().params
  const space = useSpace()

  const handleItemPress = (item: ArtistListItem_artist$data) => {
    router.navigate("CreateOrEditAlbumChooseArtworks", {
      mode,
      albumId,
      slug: item.slug,
    })
  }

  return (
    <Screen>
      <Screen.Header
        title={mode === "edit" ? "Save to Album" : "Add to Album"}
        onBack={router.goBack}
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
