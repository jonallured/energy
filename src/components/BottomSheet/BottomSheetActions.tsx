import {
  BriefcaseIcon,
  Button,
  EditIcon,
  EnvelopeIcon,
  Flex,
  Text,
  TrashIcon,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import {
  BottomSheetModalRow,
  BottomSheetModalView,
  BottomSheetRef,
} from "components/BottomSheet/BottomSheetModalView"
import { useEffect, useRef } from "react"
import { Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAlbum } from "screens/Albums/useAlbum"
import { useMailComposer } from "screens/Artwork/useMailComposer"
import { useSaveNavigationHistory } from "system/hooks/useNavigationHistory"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"

interface BottomSheetActionsProps {
  albumId?: string
  onSetRef?: (bottomSheetRef: BottomSheetRef) => void
}

export const BottomSheetActions: React.FC<BottomSheetActionsProps> = ({ albumId, onSetRef }) => {
  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const { saveNavigationHistory } = useSaveNavigationHistory()
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )
  const { album } = useAlbum({ albumId: albumId ?? "" })
  const { sendMail } = useMailComposer()

  // If we're in album mode, more actions are available to user
  const isAlbumMode = !!album

  // If the parent needs the modal sheet ref for some reason, call back
  useEffect(() => {
    if (bottomSheetRef.current) {
      onSetRef?.(bottomSheetRef.current!)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlers = {
    /**
     * Artwork actions
     */

    addArtworkToAlbum: () => {
      saveNavigationHistory("before-adding-to-album")

      navigation.navigate("AddItemsToAlbum", {
        closeBottomSheetModal: handlers.closeBottomSheetModal,
        artworksToAdd: selectedItems,
      })
    },

    shareArtworksByEmail: async () => {
      await sendMail({ artworks: selectedItems as SelectedItemArtwork[] })
    },

    /**
     * Album actions
     */

    editAlbum: () => {
      if (!isAlbumMode) {
        return
      }

      navigation.navigate("CreateOrEditAlbum", { mode: "edit", albumId })
      bottomSheetRef.current?.closeBottomSheetModal()
    },

    emailAlbum: () => {
      if (!isAlbumMode) {
        return
      }

      bottomSheetRef.current?.closeBottomSheetModal()

      const artworks = album.items.filter(
        (item) => item?.__typename === "Artwork"
      ) as SelectedItemArtwork[]

      sendMail({ artworks })
    },

    deleteAlbum: () => {
      if (!isAlbumMode) {
        return
      }

      Alert.alert("Are you sure you want to delete this album?", "You cannot undo this action.", [
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
      ])
    },

    showBottomSheetModal: () => {
      bottomSheetRef.current?.showBottomSheetModal()
    },

    closeBottomSheetModal: () => {
      bottomSheetRef.current?.closeBottomSheetModal()
    },
  }

  const modalHeight = (() => {
    if (isAlbumMode) {
      return 370 // yolo
    } else {
      if (safeAreaInsets.bottom > 0) {
        return safeAreaInsets.bottom + 230
      } else {
        return 250
      }
    }
  })()

  return (
    <>
      {!isAlbumMode && selectedItems.length > 0 && (
        <Flex
          position="absolute"
          bottom={0}
          px={2}
          pt={1}
          backgroundColor="background"
          pb={safeAreaInsets.bottom > 0 ? `${safeAreaInsets.bottom}px` : 2}
          width="100%"
        >
          <Text variant="xs" color="primary" mb={1} textAlign="center">
            Selected items: {selectedItems.length}
          </Text>
          <Button block onPress={handlers.showBottomSheetModal}>
            Add to Album or Email
          </Button>
        </Flex>
      )}

      <BottomSheetModalView
        ref={bottomSheetRef}
        modalHeight={modalHeight}
        modalRows={
          <>
            {isAlbumMode ? (
              <>
                <BottomSheetModalRow
                  Icon={<EditIcon fill="onBackgroundHigh" />}
                  label="Edit Album"
                  onPress={handlers.editAlbum}
                />
                <BottomSheetModalRow
                  Icon={<TrashIcon fill="onBackgroundHigh" />}
                  label="Delete Album"
                  onPress={handlers.deleteAlbum}
                />
                <BottomSheetModalRow
                  Icon={<EnvelopeIcon fill="onBackgroundHigh" />}
                  label="Send Album by Email"
                  onPress={handlers.emailAlbum}
                  isLastRow
                />
              </>
            ) : (
              // Artwork mode
              <>
                <BottomSheetModalRow
                  Icon={<BriefcaseIcon fill="onBackgroundHigh" />}
                  label="Add to Album"
                  onPress={handlers.addArtworkToAlbum}
                />
                <BottomSheetModalRow
                  Icon={<EnvelopeIcon fill="onBackgroundHigh" />}
                  label="Share by Email"
                  onPress={handlers.shareArtworksByEmail}
                  isLastRow
                />
              </>
            )}
          </>
        }
      />
    </>
  )
}
