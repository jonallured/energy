import { Button, Flex, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { NavigationScreens } from "app/Navigation"
import { AlbumListItem } from "app/components/Items/AlbumListItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsFlatList } from "app/components/Tabs/TabsContent"
import { GlobalStore } from "app/system/store/GlobalStore"

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
          paddingTop: space("2"),
          paddingBottom: space("2") + 60,
          paddingHorizontal: space("2"),
        }}
        renderItem={({ item: album }) => (
          <Touchable
            onPress={() => navigation.navigate("AlbumTabs", { albumId: album.id })}
            key={album.id}
            style={{ width: isTablet() ? (screenWidth - 60) / 2 : "auto" }}
          >
            <AlbumListItem album={album} />
          </Touchable>
        )}
        keyExtractor={(item) => item?.id}
        ListEmptyComponent={<ListEmptyComponent mx={0} />}
      />
      <Flex
        position="absolute"
        bottom={0}
        px={2}
        pt={2}
        pb={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 2}
        width="100%"
      >
        <Button block onPress={() => navigation.navigate("CreateOrEditAlbum", { mode: "create" })}>
          Create New Album
        </Button>
      </Flex>
    </>
  )
}
