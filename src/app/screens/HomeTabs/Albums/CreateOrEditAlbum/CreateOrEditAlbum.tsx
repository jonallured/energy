import {
  Spacer,
  ArrowRightIcon,
  Button,
  Flex,
  Input,
  Text,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useFormik } from "formik"
import { useState } from "react"
import { useLazyLoadQuery } from "react-relay"
import { object, string } from "yup"
import { AlbumArtworksQuery } from "__generated__/AlbumArtworksQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { useNavigationSavedForKey } from "app/navigation/navAtoms"
import { albumArtworksQuery } from "app/screens/HomeTabs/Albums/AlbumTabs/AlbumArtworks"
import { usePresentationFilteredArtworks } from "app/screens/HomeTabs/usePresentationFilteredArtworks"
import { ArtworkGridItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Screen } from "palette"
import { extractNodes } from "shared/utils"

interface CreateAlbumValuesSchema {
  albumName: string
}

const createAlbumSchema = object().shape({
  albumName: string().required("Album name is required").trim(),
})

type CreateOrEditAlbumRoute = RouteProp<NavigationScreens, "CreateOrEditAlbum">

export const CreateOrEditAlbum = () => {
  const { mode, albumId, artworkIdToAdd, closeBottomSheetModal } =
    useRoute<CreateOrEditAlbumRoute>().params || {
      mode: "create",
    }
  const [hasSavedNav, navigateToSaved] = useNavigationSavedForKey("before-adding-to-album")
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const [selectedArtworksToRemove, setSelectedArtworksToRemove] = useState<string[]>([])
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const selectedArtworksForNewAlbum = GlobalStore.useAppState(
    (state) => state.albums.sessionState.selectedArtworksForNewAlbum
  )
  const selectedArtworksForExistingAlbum = GlobalStore.useAppState(
    (state) => state.albums.sessionState.selectedArtworksForExistingAlbum
  )

  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isActive)
  const artworksFromSelectMode = GlobalStore.useAppState((state) => state.selectMode.artworks)
  const selectedInstalls = GlobalStore.useAppState((state) => state.selectMode.installs)
  const selectedDocuments = GlobalStore.useAppState((state) => state.selectMode.documents)
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)
  const space = useSpace()

  // Assigning selected artworks
  let selectedArtworks: string[] = []
  if (artworkIdToAdd) {
    // Case when single artwork selected from Artwork screen
    selectedArtworks = [artworkIdToAdd]
  } else if (isSelectModeActive) {
    // Case when atworks are selected from Select mode
    selectedArtworks = artworksFromSelectMode
  } else {
    // Case when artworks are selected from Album tab
    if (mode === "create") {
      // Case when we want to create new album
      selectedArtworks = Object.values(selectedArtworksForNewAlbum).flat()
    } else {
      // Case when we want to edit existing album
      selectedArtworks = [
        ...(album?.artworkIds ?? []),
        ...Object.values(selectedArtworksForExistingAlbum).flat(),
      ]
    }
  }

  const artworksData = useLazyLoadQuery<AlbumArtworksQuery>(albumArtworksQuery, {
    partnerID,
    artworkIDs: selectedArtworks,
  })

  /* If we pass empty ids(selectedArtworks) as parameter in the albumArtworksQuery API,
  MP returns random artworks(instead of returning empty object),
  To avoid we have this condition to assign the artworks with fetched data only
  when the selectedArtworks is not empty */
  const artworks =
    selectedArtworks.length > 0 ? extractNodes(artworksData.partner?.artworksConnection) : []

  // Filterering based on presentation mode
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  const { handleSubmit, handleChange, values, errors, validateForm, isValid, dirty, isSubmitting } =
    useFormik<CreateAlbumValuesSchema>({
      initialValues: {
        albumName: mode === "edit" ? album?.name ?? "" : "",
      },
      initialErrors: {},
      onSubmit: () => {
        try {
          if (mode === "edit" && albumId) {
            GlobalStore.actions.albums.editAlbum({
              albumId: albumId,
              name: values.albumName,
              artworkIds: selectedArtworks.filter((ids) => !selectedArtworksToRemove.includes(ids)),
            })
          } else {
            GlobalStore.actions.albums.addAlbum({
              name: values.albumName.trim(),
              artworkIds: selectedArtworks,
              installShotUrls: selectedInstalls,
              documentIds: selectedDocuments,
            })
          }

          hasSavedNav ? navigateToSaved() : navigation.goBack()
          closeBottomSheetModal?.()
          if (isSelectModeActive) {
            GlobalStore.actions.selectMode.cancelSelectMode()
          }
        } catch (error) {
          console.error(error)
        }
      },
      validationSchema: createAlbumSchema,
    })

  const selectArtworkHandler = (artworkId: string) => {
    if (!selectedArtworksToRemove.includes(artworkId)) {
      setSelectedArtworksToRemove([...selectedArtworksToRemove, artworkId])
    } else {
      const unSelectedArtworkIds = selectedArtworksToRemove.filter((id) => id !== artworkId)
      setSelectedArtworksToRemove(unSelectedArtworkIds)
    }
  }

  let isActionButtonEnabled = isValid && !isSubmitting

  if (mode === "create") {
    // Case when we want to create new album
    isActionButtonEnabled =
      isActionButtonEnabled &&
      dirty &&
      (selectedArtworks.length > 0 ||
        selectedInstalls.length > 0 ||
        selectedDocuments.length > 0 ||
        artworkIdToAdd !== undefined)
  } else {
    // Case when we want to edit existing album
    isActionButtonEnabled =
      isActionButtonEnabled &&
      (dirty ||
        Object.values(selectedArtworksForExistingAlbum).flat().length > 0 ||
        selectedArtworksToRemove.length > 0 ||
        selectedInstalls.length > 0 ||
        selectedDocuments.length > 0)
  }

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
        {isSelectModeActive ||
          (!artworkIdToAdd && (
            <Touchable
              onPress={() =>
                navigation.navigate("CreateOrEditAlbumChooseArtist", { mode, albumId })
              }
            >
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                <Text>Add Items to Album</Text>
                <ArrowRightIcon fill="onBackgroundHigh" />
              </Flex>
            </Touchable>
          ))}
        {mode === "edit" && (
          <Text mt={2} variant="xs" color="onBackgroundMedium">
            Select artworks to remove from album
          </Text>
        )}
        <MasonryList
          contentContainerStyle={{
            marginTop: space(2),
          }}
          numColumns={2}
          data={presentedArtworks}
          renderItem={({ item: artwork, i }) => {
            if (mode === "create") {
              return (
                <ArtworkGridItem
                  artwork={artwork}
                  style={{
                    marginLeft: i % 2 === 0 ? 0 : space("1"),
                    marginRight: i % 2 === 0 ? space("1") : 0,
                  }}
                />
              )
            }
            return (
              <ArtworkGridItem
                artwork={artwork}
                onPress={() => selectArtworkHandler(artwork.internalID)}
                selectedToRemove={selectedArtworksToRemove.includes(artwork.internalID)}
                style={{
                  marginLeft: i % 2 === 0 ? 0 : space("1"),
                  marginRight: i % 2 === 0 ? space("1") : 0,
                }}
              />
            )
          }}
          keyExtractor={(item) => item.internalID}
        />
        <Flex px={1} pt={2}>
          <Button block onPress={handleSubmit} disabled={!isActionButtonEnabled}>
            {mode === "edit" ? "Save" : "Create"}
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
