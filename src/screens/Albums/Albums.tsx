import { Button, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { Screen } from "components/Screen"
import { useWindowDimensions } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
import { isTablet } from "react-native-device-info"
import { AlbumListItem } from "screens/Albums/AlbumTabs/AlbumListItem"
import { GlobalStore } from "system/store/GlobalStore"

export const Albums = () => {
  const space = useSpace()
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const screenWidth = useWindowDimensions().width

  return (
    <Screen>
      <Tabs.FlatList
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
      <Screen.BottomView>
        <Button block onPress={() => navigation.navigate("CreateOrEditAlbum", { mode: "create" })}>
          Create New Album
        </Button>
      </Screen.BottomView>
    </Screen>
  )
}
