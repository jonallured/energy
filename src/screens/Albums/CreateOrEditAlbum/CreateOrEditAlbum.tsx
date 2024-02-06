import {
  Spacer,
  Screen,
  ArrowRightIcon,
  Button,
  Flex,
  Input,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ArtworksList } from "components/Lists/ArtworksList"
import { useToast } from "components/Toast/ToastContext"
import { useFormik } from "formik"
import React, { useEffect } from "react"
import { Platform } from "react-native"
import { useAlbum } from "screens/Albums/useAlbum"
import { useNavigateToSavedHistory } from "system/hooks/useNavigationHistory"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import {
  SelectedItem,
  SelectedItemArtwork,
} from "system/store/Models/SelectModeModel"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"
import { useSelectedItems } from "utils/hooks/useSelectedItems"
import { waitForScreenTransition } from "utils/waitForScreenTransition"
import { object, string } from "yup"

export interface CreateAlbumValuesSchema {
  albumName: string
}

export type AlbumEditMode = "create" | "edit"

const createAlbumSchema = object().shape({
  albumName: string().required("Album name is required").trim(),
})

type CreateOrEditAlbumRoute = RouteProp<NavigationScreens, "CreateOrEditAlbum">

export const CreateOrEditAlbum = () => {
  useTrackScreen({ name: "CreateOrEditAlbum", type: "Album" })

  const { mode, albumId, artworksToAdd } = useRoute<CreateOrEditAlbumRoute>()
    .params || {
    mode: "create",
  }

  const { navigateToSavedHistory } = useNavigateToSavedHistory()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const isDarkMode = useIsDarkMode()
  const { toast } = useToast()
  const { selectedItems } = useSelectedItems()
  const queuedItemsToAdd = GlobalStore.useAppState(
    (state) => state.albums.sessionState.queuedItemsToAdd
  )

  const { album, artworks, saveAlbum } = useAlbum({
    albumId: albumId as string,
  })

  /**
   * We pass back selected artwork items from subsequent screens via the router.
   * When changed, persist it to the queue before we save.
   */
  useEffect(() => {
    GlobalStore.actions.albums.queueItemsToAdd({
      items: artworksToAdd,
      album,
    })
  }, [artworksToAdd, album?.items])

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    validateForm,
    isValid,
    isSubmitting,
  } = useFormik<CreateAlbumValuesSchema>({
    initialValues: {
      albumName: mode === "edit" ? album?.name ?? "" : "",
    },
    initialErrors: {},
    onSubmit: () => {
      try {
        saveAlbum({ mode, values })

        navigateToSavedHistory({
          lookupKey: "before-adding-to-album",

          onComplete: () => {
            waitForScreenTransition(() => {
              // Don't want to clear before screen transition, because we dont
              // want the presented items to disappear from the view during
              // transition leading to layout thrash.
              GlobalStore.actions.selectMode.cancelSelectMode()
              GlobalStore.actions.albums.clearItemQueue()

              toast.show({
                title: `Successfully ${
                  mode === "edit" ? "edited" : "created"
                } album.`,
                type: "success",
              })
            })
          },
        })
      } catch (error) {
        console.error(error)
      }
    },
    validationSchema: createAlbumSchema,
  })

  const isActionButtonEnabled =
    isValid && !isSubmitting && queuedItemsToAdd.length > 0

  const showRemoveMessage = mode === "edit" && artworks.length > 0

  return (
    <Screen>
      <Screen.Header
        title={mode === "edit" ? "Edit Album" : "Create Album"}
        onBack={navigation.goBack}
      />

      <Screen.Body fullwidth>
        <Flex flex={1} px={2}>
          <Flex>
            <Input
              title="Album Name"
              onChangeText={handleChange("albumName")}
              onBlur={() => validateForm()}
              defaultValue={values.albumName}
              error={errors.albumName}
            />
          </Flex>

          {mode === "create" && (
            <>
              <Spacer y={1} />

              <Text variant="xs" color="black60">
                Albums created in Folio are locally stored and not accessible on
                other devices.
              </Text>
            </>
          )}

          <Spacer y={2} />

          <Touchable
            onPress={() => {
              navigation.navigate("CreateOrEditAlbumChooseArtist", {
                mode,
                albumId,
              })

              waitForScreenTransition(() => {
                GlobalStore.actions.selectMode.cancelSelectMode()
              })
            }}
          >
            <Flex
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text>Add Items to Album</Text>
              <ArrowRightIcon fill="onBackgroundHigh" />
            </Flex>
          </Touchable>

          <Spacer y={1} />

          {!!showRemoveMessage && (
            <Text variant="xs" color="onBackgroundMedium">
              Select artworks to remove from album
            </Text>
          )}

          <Spacer y={2} />

          <ArtworksList
            artworks={queuedItemsToAdd as SelectedItemArtwork[]}
            onItemPress={(item) => {
              if (mode === "edit") {
                GlobalStore.actions.selectMode.toggleSelectedItem(item)
              }
            }}
            checkIfSelectedToRemove={(item) => {
              return (
                mode === "edit" &&
                !!selectedItems.find(
                  (selectedItem) => selectedItem?.internalID === item.internalID
                )
              )
            }}
            contentContainerStyle={{
              paddingHorizontal: 0,
            }}
            isStatic
          />
        </Flex>

        {Platform.OS === "ios" ? (
          <Screen.BottomView darkMode={isDarkMode}>
            <CreateOrEditButton
              onSubmit={handleSubmit}
              isActionButtonEnabled={isActionButtonEnabled}
              showRemoveMessage={showRemoveMessage}
              selectedItems={selectedItems}
              mode={mode}
            />
          </Screen.BottomView>
        ) : (
          <CreateOrEditButton
            onSubmit={handleSubmit}
            isActionButtonEnabled={isActionButtonEnabled}
            showRemoveMessage={showRemoveMessage}
            selectedItems={selectedItems}
            mode={mode}
          />
        )}
      </Screen.Body>
    </Screen>
  )
}

interface CreateOrEditButtonProps {
  onSubmit: () => void
  isActionButtonEnabled: boolean
  mode: "create" | "edit"
  showRemoveMessage: boolean
  selectedItems: SelectedItem[]
}

const CreateOrEditButton: React.FC<CreateOrEditButtonProps> = ({
  onSubmit,
  isActionButtonEnabled,
  mode,
  showRemoveMessage,
  selectedItems,
}) => {
  const isDarkMode = useIsDarkMode()

  const buttonLabel = (() => {
    const selectedItemsLength = selectedItems.length

    if (mode === "edit") {
      if (showRemoveMessage && selectedItemsLength > 0) {
        return `Remove ${selectedItemsLength} ${
          selectedItemsLength > 1 ? "items" : "item"
        }`
      }
      return "Save"
    } else {
      return "Create"
    }
  })()

  return (
    <Flex>
      <Button
        block
        variant={isDarkMode ? "fillLight" : "fillDark"}
        onPress={onSubmit}
        disabled={!isActionButtonEnabled}
      >
        <Text
          color={isDarkMode ? "black100" : "white100"}
          style={{ textDecorationLine: "none" }}
        >
          {buttonLabel}
        </Text>
      </Button>
    </Flex>
  )
}
