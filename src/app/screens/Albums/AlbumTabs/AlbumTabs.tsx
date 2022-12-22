import { EditIcon, Flex, Touchable, TrashIcon, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Alert } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
import { NavigationScreens } from "app/Navigation"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { GlobalStore } from "app/system/store/GlobalStore"
import { ErrorBoundary } from "app/system/wrappers/ErrorBoundary"
import { SuspenseWrapper } from "app/system/wrappers/SuspenseWrapper"
import { Screen } from "palette"
import { AlbumArtworks } from "./AlbumArtworks"
import { AlbumDocuments } from "./AlbumDocuments"
import { AlbumInstalls } from "./AlbumInstalls"

type AlbumTabsRoute = RouteProp<NavigationScreens, "AlbumTabs">

export const AlbumTabs = () => {
  const { albumId } = useRoute<AlbumTabsRoute>().params
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)
  const space = useSpace()

  if (!album) {
    return <ListEmptyComponent />
  }

  const deleteAlbumHandler = () => {
    return Alert.alert(
      "Are you sure you want to delete this album?",
      "You cannot undo this action.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            GlobalStore.actions.albums.removeAlbum(album.id)
            navigation.goBack()
          },
        },
      ]
    )
  }

  const editAlbumHandler = () => {
    GlobalStore.actions.albums.clearSelectedArtworksForEditAlbum()
    navigation.navigate("CreateOrEditAlbum", { mode: "edit", albumId })
  }

  return (
    <Screen>
      <Screen.AnimatedTitleHeader
        title={album.name}
        rightElements={
          <Flex flexDirection="row" alignItems="center">
            <Touchable onPress={deleteAlbumHandler} style={{ marginRight: space(2) }}>
              <TrashIcon fill="onBackgroundHigh" width={25} height={25} />
            </Touchable>
            <Touchable onPress={editAlbumHandler}>
              <EditIcon fill="onBackgroundHigh" width={25} height={25} />
            </Touchable>
          </Flex>
        }
      />
      <Screen.AnimatedTitleTabsBody>
        <Tabs.Tab name="AlbumArtworks" label="Works">
          <ErrorBoundary withoutBackButton>
            <SuspenseWrapper withTabs>
              <AlbumArtworks artworkIds={album.artworkIds} />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Tabs.Tab>
        <Tabs.Tab name="AlbumInstalls" label="Installs">
          <ErrorBoundary withoutBackButton>
            <SuspenseWrapper withTabs>
              <AlbumInstalls installShotUrls={album.installShotUrls} />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Tabs.Tab>
        <Tabs.Tab name="AlbumDocuments" label="Documents">
          <ErrorBoundary withoutBackButton>
            <SuspenseWrapper withTabs>
              <AlbumDocuments documentIDs={album.documentIds} />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Tabs.Tab>
      </Screen.AnimatedTitleTabsBody>
    </Screen>
  )
}
