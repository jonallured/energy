import { EditIcon, Flex, Touchable, TrashIcon, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "app/Navigation"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabScreen } from "app/components/Tabs/TabScreen"
import { GlobalStore } from "app/system/store/GlobalStore"
import {
  SelectedItem,
  SelectedItemArtwork,
  SelectedItemInstall,
} from "app/system/store/Models/SelectModeModel"
import { Screen } from "palette"
import { Alert } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
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
    navigation.navigate("CreateOrEditAlbum", { mode: "edit", albumId })
  }

  const { artworkIds, installShotUrls, documentIds } = getAlbumIds(album.items)

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
          <TabScreen>
            <AlbumArtworks artworkIds={artworkIds} />
          </TabScreen>
        </Tabs.Tab>
        <Tabs.Tab name="AlbumInstalls" label="Installs">
          <AlbumInstalls installShotUrls={installShotUrls} />
        </Tabs.Tab>
        <Tabs.Tab name="AlbumDocuments" label="Documents">
          <TabScreen>
            <AlbumDocuments documentIDs={documentIds} />
          </TabScreen>
        </Tabs.Tab>
      </Screen.AnimatedTitleTabsBody>
    </Screen>
  )
}

export const getAlbumIds = (items: SelectedItem[]) => {
  const artworkIds = items
    .filter((item) => {
      const artwork = item as SelectedItemArtwork
      return artwork.__typename === "Artwork"
    })
    .map((artwork) => artwork?.internalID as string)

  const installShotUrls = items
    .filter((item) => {
      return item?.__typename === "Image"
    })
    .map((image) => {
      return (image as SelectedItemInstall).resized?.url!
    })

  const documentIds = items
    .filter((item) => {
      return item?.__typename === "PartnerDocument"
    })
    .map((document) => {
      return document?.internalID as string
    })

  return {
    artworkIds,
    installShotUrls,
    documentIds,
  }
}
