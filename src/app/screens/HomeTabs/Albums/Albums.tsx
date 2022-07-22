import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { AlbumListItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { TabsScrollView } from "app/wrappers"
import { Button, Flex, Touchable } from "palette"

export const Albums = () => {
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()

  return (
    <>
      <TabsScrollView>
        <Flex>
          {albums.length > 0 ? (
            <Flex mx={2} mb={6}>
              {albums.map((album) => (
                <Touchable
                  onPress={() => {
                    navigation.navigate("AlbumArtworks", { albumId: album.id })
                  }}
                  key={album.id}
                >
                  <Flex mb={3} mt={1}>
                    <AlbumListItem album={album} />
                  </Flex>
                </Touchable>
              ))}
            </Flex>
          ) : (
            <ListEmptyComponent />
          )}
        </Flex>
      </TabsScrollView>
      <Flex
        position="absolute"
        bottom={0}
        px={2}
        pt={2}
        pb={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 2}
        width="100%"
        backgroundColor="white100"
      >
        <Button block onPress={() => navigation.navigate("CreateOrEditAlbum", { mode: "create" })}>
          Create New Album
        </Button>
      </Flex>
    </>
  )
}
