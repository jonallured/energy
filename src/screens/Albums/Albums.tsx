import { Button, Screen } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { Tabs } from "react-native-collapsible-tab-view"
import { isTablet } from "react-native-device-info"
import { AlbumListItem } from "screens/Albums/AlbumTabs/AlbumListItem"
import { GlobalStore } from "system/store/GlobalStore"
import { getContentContainerStyle } from "utils/getContentContainerStyle"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

export const Albums = () => {
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const isDarkMode = useIsDarkMode()

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Tabs.FlatList
          data={albums}
          numColumns={isTablet() ? 2 : 1}
          contentContainerStyle={getContentContainerStyle()}
          renderItem={({ item: album }) => {
            return (
              <AlbumListItem
                album={album}
                onPress={() => {
                  navigation.navigate("AlbumTabs", { albumId: album.id })
                }}
              />
            )
          }}
          keyExtractor={(item) => item?.id}
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
