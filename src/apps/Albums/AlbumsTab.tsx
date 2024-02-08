import { Button, Screen, Spacer, Tabs } from "@artsy/palette-mobile"
import { AlbumListItem } from "apps/Albums/routes/AlbumTabs/AlbumListItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { useRouter } from "system/hooks/useRouter"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { Album } from "system/store/Models/AlbumsModel"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

export const AlbumsTab: React.FC = () => {
  useTrackScreen({ name: "Albums", type: "Albums" })

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const { router } = useRouter()
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
                    router.navigate("AlbumTabs", { albumId: album.id })
                  }}
                />
                <Spacer y={2} />
              </>
            )
          }}
          keyExtractor={(item: Album) => item?.id}
          ListEmptyComponent={<ListEmptyComponent />}
        />

        <Screen.BottomView darkMode={isDarkMode}>
          <Button
            block
            variant={isDarkMode ? "fillLight" : "fillDark"}
            onPress={() =>
              router.navigate("CreateOrEditAlbum", { mode: "create" })
            }
          >
            Create New Album
          </Button>
        </Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}
