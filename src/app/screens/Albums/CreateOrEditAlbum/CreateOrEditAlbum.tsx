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
import { AlbumArtworksQuery } from "__generated__/AlbumArtworksQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ArtworkGridItem } from "app/components/Items/ArtworkGridItem"
import { albumArtworksQuery } from "app/screens/Albums/AlbumTabs/AlbumArtworks"
import { useNavigationSavedForKey } from "app/system/hooks/useNavigationSave"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItem } from "app/system/store/Models/SelectModeModel"
import { extractNodes } from "app/utils/extractNodes"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"
import { useFormik } from "formik"
import { differenceBy } from "lodash"
import { Screen } from "palette"
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
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!

  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)
  const space = useSpace()

  // Assigning selected artworks
  let artworksToSave: SelectedItem[] = []
  if (artworkToAdd) {
    // Case when single artwork selected from Artwork screen
    artworksToSave = [artworkToAdd]
  } else if (artworksToAdd) {
    // Selecting multiple artworks from choose artworks screen
    artworksToSave = artworksToAdd
  } else {
    artworksToSave = [...(album?.items ?? [])]
  }

  const artworksData = useSystemQueryLoader<AlbumArtworksQuery>(albumArtworksQuery, {
    partnerID,
    artworkIDs: artworksToSave.map((artwork) => artwork?.internalID!),
  })

  /* If we pass empty ids(selectedArtworks) as parameter in the albumArtworksQuery API,
  MP returns random artworks(instead of returning empty object),
  To avoid we have this condition to assign the artworks with fetched data only
  when the selectedArtworks is not empty */
  const artworks =
    artworksToSave.length > 0 ? extractNodes(artworksData.partner?.artworksConnection) : []

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
  console.log(isActionButtonEnabled, selectedItems)

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
          (!artworkToAdd && (
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

        {mode === "edit" && presentedArtworks.length > 0 && (
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
            return (
              <ArtworkGridItem
                artwork={artwork}
                onPress={() => {
                  GlobalStore.actions.selectMode.toggleSelectedItem(artwork as SelectedItem)
                }}
                selectedToRemove={
                  mode === "edit" &&
                  !!selectedItems.find((item) => item?.internalID === artwork.internalID)
                }
                style={{
                  marginLeft: i % 2 === 0 ? 0 : space(1),
                  marginRight: i % 2 === 0 ? space(1) : 0,
                }}
              />
            )
          }}
          keyExtractor={(item) => item.internalID}
        />
        <Screen.BottomView>
          <Flex px={1} pt={2}>
            <Button block onPress={() => handleSubmit()} disabled={!isActionButtonEnabled}>
              {mode === "edit" ? "Save" : "Create"}
            </Button>
          </Flex>
        </Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}
