import {
  DEFAULT_HIT_SLOP,
  EditIcon,
  EnvelopeIcon,
  MoreIcon,
  Touchable,
  TrashIcon,
} from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import {
  BottomSheetModalRow,
  BottomSheetModalView,
  BottomSheetRef,
} from "components/BottomSheetModalView"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { Screen } from "components/Screen"
import { SCREEN_HORIZONTAL_PADDING } from "components/Screen/exposed/Body"
import { TabScreen } from "components/Tabs/TabScreen"
import { useRef } from "react"
import { Alert } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
import { useMailComposer } from "screens/Artwork/useMailComposer"
import { GlobalStore } from "system/store/GlobalStore"
import {
  SelectedItem,
  SelectedItemArtwork,
  SelectedItemInstall,
} from "system/store/Models/SelectModeModel"
import { AlbumArtworks } from "./AlbumArtworks"
import { AlbumDocuments } from "./AlbumDocuments"
import { AlbumInstalls } from "./AlbumInstalls"

type AlbumTabsRoute = RouteProp<NavigationScreens, "AlbumTabs">

export const AlbumTabs = () => {
  const { albumId } = useRoute<AlbumTabsRoute>().params
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const { sendMail } = useMailComposer()

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

  const { installShotImages, documentIds } = getAlbumIds(album.items)

  const addToButtonHandler = () => {
    bottomSheetRef.current?.showBottomSheetModal()
  }

  const editAlbumHandler = () => {
    navigation.navigate("CreateOrEditAlbum", { mode: "edit", albumId })
    bottomSheetRef.current?.closeBottomSheetModal()
  }

  const emailAlbumHandler = () => {
    bottomSheetRef.current?.closeBottomSheetModal()

    const artworks = album.items.filter(
      (item) => item?.__typename === "Artwork"
    ) as SelectedItemArtwork[]

    sendMail({ artworks })
  }

  return (
    <BottomSheetModalProvider>
      <Screen>
        <Screen.AnimatedTitleHeader
          title={album.name}
          rightElements={
            <Touchable
              onPress={addToButtonHandler}
              hitSlop={DEFAULT_HIT_SLOP}
              style={{ paddingRight: `${SCREEN_HORIZONTAL_PADDING}%` }}
            >
              <MoreIcon />
            </Touchable>
          }
        />
        <Screen.AnimatedTitleTabsBody>
          <Tabs.Tab name="AlbumArtworks" label="Works">
            <TabScreen>
              <AlbumArtworks albumId={albumId} />
            </TabScreen>
          </Tabs.Tab>
          <Tabs.Tab name="AlbumInstalls" label="Installs">
            <AlbumInstalls images={installShotImages} />
          </Tabs.Tab>
          <Tabs.Tab name="AlbumDocuments" label="Documents">
            <TabScreen>
              <AlbumDocuments documentIDs={documentIds} />
            </TabScreen>
          </Tabs.Tab>
        </Screen.AnimatedTitleTabsBody>
      </Screen>

      <BottomSheetModalView
        ref={bottomSheetRef}
        modalHeight={370}
        modalRows={
          <>
            <BottomSheetModalRow
              Icon={<EditIcon fill="onBackgroundHigh" />}
              label="Edit Album"
              onPress={editAlbumHandler}
            />
            <BottomSheetModalRow
              Icon={<TrashIcon fill="onBackgroundHigh" />}
              label="Delete Album"
              onPress={deleteAlbumHandler}
            />
            <BottomSheetModalRow
              Icon={<EnvelopeIcon fill="onBackgroundHigh" />}
              label="Send Album by Email"
              onPress={emailAlbumHandler}
              isLastRow
            />
          </>
        }
      />
    </BottomSheetModalProvider>
  )
}

export const getAlbumIds = (items: SelectedItem[]) => {
  const artworkIds = items
    .filter((item) => {
      const artwork = item as SelectedItemArtwork
      return artwork.__typename === "Artwork"
    })
    .map((artwork) => artwork?.internalID as string)

  const installShotImages = items
    .filter((item) => {
      return item?.__typename === "Image"
    })
    .map((image) => {
      return image as SelectedItemInstall
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
    installShotImages,
    documentIds,
  }
}
