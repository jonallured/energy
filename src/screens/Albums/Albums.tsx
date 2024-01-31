import { Button, Screen, Spacer, Tabs } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { AlbumListItem } from "screens/Albums/AlbumTabs/AlbumListItem"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { Album } from "system/store/Models/AlbumsModel"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

export const Albums = () => {
  useTrackScreen({ name: "Albums", type: "Albums" })

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const isDarkMode = useIsDarkMode()

  return (
    <Screen safeArea={false}>
      <Screen.Body fullwidth>
        <Tabs.FlatList
          data={albums}
          numColumns={1}
          renderItem={({ item: album }: { item: Album }) => {
            return (
              <>
                <AlbumListItem
                  album={album}
                  onPress={() => {
                    navigation.navigate("AlbumTabs", { albumId: album.id })
                  }}
                />
                <Spacer y={1} />
              </>
            )
          }}
          keyExtractor={(item: Album) => item?.id}
          ListEmptyComponent={<ListEmptyComponent />}
        />

        <Screen.BottomView darkMode={isDarkMode}>
          <Button
            block
            onPress={() => navigation.navigate("CreateOrEditAlbum", { mode: "create" })}
          >
            Create New Album
          </Button>
        </Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}
