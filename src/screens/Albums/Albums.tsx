import { Button, Flex, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { TabsFlatList } from "components/Tabs/TabsContent"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AlbumListItem } from "screens/Albums/AlbumTabs/AlbumListItem"
import { GlobalStore } from "system/store/GlobalStore"

export const Albums = () => {
  const space = useSpace()
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const screenWidth = useWindowDimensions().width

  return (
    <>
      <TabsFlatList
        columnWrapperStyle={
          isTablet() ? { justifyContent: "space-between", alignItems: "flex-end" } : null
        }
        data={albums}
        numColumns={isTablet() ? 2 : 1}
        contentContainerStyle={{
          paddingBottom: space(2) + 60,
          paddingHorizontal: space(2),
        }}
        renderItem={({ item: album }) => {
          return (
            <Touchable
              onPress={() => navigation.navigate("AlbumTabs", { albumId: album.id })}
              key={album.id}
              style={{ width: isTablet() ? (screenWidth - 60) / 2 : "auto" }}
            >
              <AlbumListItem album={album} />
            </Touchable>
          )
        }}
        keyExtractor={(item) => item?.id}
        ListEmptyComponent={<ListEmptyComponent />}
      />
      <Flex
        position="absolute"
        bottom={0}
        px={2}
        pt={2}
        pb={safeAreaInsets.bottom > 0 ? `${safeAreaInsets.bottom}px` : 2}
        width="100%"
      >
        <Button block onPress={() => navigation.navigate("CreateOrEditAlbum", { mode: "create" })}>
          Create New Album
        </Button>
      </Flex>
    </>
  )
}
