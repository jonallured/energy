import { Spacer, ArrowRightIcon, Button, Flex, Input, Text, Touchable } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "app/Navigation"
import { ArtworksList } from "app/components/Lists/ArtworksList"
import { useAlbum } from "app/screens/Albums/useAlbum"
import { useNavigationSavedForKey } from "app/system/hooks/useNavigationSave"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItem, SelectedItemArtwork } from "app/system/store/Models/SelectModeModel"
import { useFormik } from "formik"
import { differenceBy, uniqBy } from "lodash"
import { Screen } from "palette"
import { Platform } from "react-native"
import { object, string } from "yup"

interface CreateAlbumValuesSchema {
  albumName: string
}

const createAlbumSchema = object().shape({
  albumName: string().required("Album name is required").trim(),
})

type CreateOrEditAlbumRoute = RouteProp<NavigationScreens, "CreateOrEditAlbum">

export const CreateOrEditAlbum = () => {
  const { mode, albumId, artworkToAdd, artworksToAdd, closeBottomSheetModal } =
    useRoute<CreateOrEditAlbumRoute>().params || {
      mode: "create",
    }

  const [hasSavedNav, navigateToSaved] = useNavigationSavedForKey("before-adding-to-album")
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()

  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const { album, artworks } = useAlbum({ albumId: albumId as string })

  // If we already have items in the album, merge them in
  const albumItems = album?.items ?? []

  // Assigning selected artworks
  let artworksToSave: SelectedItem[] = []
  if (artworkToAdd) {
    // Case when single artwork selected from Artwork screen
    artworksToSave = [artworkToAdd]
  } else if (artworksToAdd) {
    // Selecting multiple artworks from choose artworks screen
    artworksToSave = uniqBy([...artworksToAdd, ...albumItems], "internalID")
  } else {
    artworksToSave = [...(album?.items ?? [])]
  }

  const { handleSubmit, handleChange, values, errors, validateForm, isValid, isSubmitting } =
    useFormik<CreateAlbumValuesSchema>({
      initialValues: {
        albumName: mode === "edit" ? album?.name ?? "" : "",
      },
      initialErrors: {},
      onSubmit: () => {
        try {
          // Take the items to save and subtract selected items (items to delete)
          // which returns final result.
          const items = differenceBy(artworksToSave, selectedItems, "internalID")

          if (mode === "edit" && albumId) {
            GlobalStore.actions.albums.editAlbum({
              albumId: albumId,
              name: values.albumName,
              items,
            })
          } else {
            GlobalStore.actions.albums.addAlbum({
              name: values.albumName.trim(),
              items,
            })
          }

          GlobalStore.actions.selectMode.cancelSelectMode()

          if (hasSavedNav) {
            navigateToSaved()
          } else {
            navigation.goBack()
          }

          closeBottomSheetModal?.()
        } catch (error) {
          console.error(error)
        }
      },
      validationSchema: createAlbumSchema,
    })

  const isActionButtonEnabled = isValid && !isSubmitting && artworksToSave.length > 0

  const CreateOrEditButton = () => {
    return (
      <Flex px={1} py={2}>
        <Button block onPress={() => handleSubmit()} disabled={!isActionButtonEnabled}>
          {mode === "edit" ? "Save" : "Create"}
        </Button>
      </Flex>
    )
  }

  const showAddMessage = isSelectModeActive || !artworkToAdd
  const showRemoveMessage = mode === "edit" && artworks.length > 0

  return (
    <Screen>
      <Screen.Header title={mode === "edit" ? "Edit Album" : "Create Album"} />

      <Screen.Body>
        <Flex>
          <Input
            title="Album Name"
            onChangeText={handleChange("albumName")}
            onBlur={() => validateForm()}
            defaultValue={values.albumName}
            error={errors.albumName}
          />
        </Flex>
        <Spacer y={2} />

        {showAddMessage && (
          <Touchable
            onPress={() => navigation.navigate("CreateOrEditAlbumChooseArtist", { mode, albumId })}
          >
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
              <Text>Add Items to Album</Text>
              <ArrowRightIcon fill="onBackgroundHigh" />
            </Flex>
          </Touchable>
        )}

        {showRemoveMessage && (
          <Text mt={2} variant="xs" color="onBackgroundMedium">
            Select artworks to remove from album
          </Text>
        )}

        <ArtworksList
          artworks={artworksToSave as SelectedItemArtwork[]}
          onItemPress={(item) => {
            GlobalStore.actions.selectMode.toggleSelectedItem(item)
          }}
          checkIfSelectedToRemove={(item) => {
            return (
              mode === "edit" &&
              !!selectedItems.find((selectedItem) => selectedItem?.internalID === item.internalID)
            )
          }}
          contentContainerStyle={{
            paddingHorizontal: 0,
          }}
          isStatic
        />

        {Platform.OS === "ios" ? (
          <Screen.BottomView>
            <CreateOrEditButton />
          </Screen.BottomView>
        ) : (
          <CreateOrEditButton />
        )}
      </Screen.Body>
    </Screen>
  )
}
