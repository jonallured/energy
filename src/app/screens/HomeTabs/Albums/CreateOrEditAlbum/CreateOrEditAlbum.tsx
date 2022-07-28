import MasonryList from "@react-native-seoul/masonry-list"
import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
import { useFormik } from "formik"
import { uniq } from "lodash"
import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Yup from "yup"
import { useArtworksByMode } from "./useArtworksByMode"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header } from "app/sharedUI/Header"
import { ArtworkItem } from "app/sharedUI/items/ArtworkItem"
import { GlobalStore } from "app/store/GlobalStore"
import { ArrowRightIcon, Button, Flex, Input, Spacer, Text, Touchable, useSpace } from "palette"
import { ShadowSeparator } from "palette/elements/Separator/ShadowSeparator"

interface CreateAlbumValuesSchema {
  albumName: string
}

const createAlbumSchema = Yup.object().shape({
  albumName: Yup.string().required("Album name is required").trim(),
})

type CreateOrEditAlbumRoute = RouteProp<HomeTabsScreens, "CreateOrEditAlbum">

export const CreateOrEditAlbum = () => {
  const { mode, albumId } = useRoute<CreateOrEditAlbumRoute>().params || {
    mode: "create",
    albumId: undefined,
  }
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const safeAreaInsets = useSafeAreaInsets()
  const [selectedArtworksToRemove, setSelectedArtworksToRemove] = useState<string[]>([])

  const selectedArtworksInModel = useArtworksByMode(mode)
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)
  const selectedArtworks = uniq([...(album?.artworkIds || []), ...selectedArtworksInModel])
  const space = useSpace()

  const { handleSubmit, handleChange, values, errors, validateForm, isValid, dirty, isSubmitting } =
    useFormik<CreateAlbumValuesSchema>({
      initialValues: {
        albumName: mode === "edit" ? album?.name ?? "" : "",
      },
      initialErrors: {},
      onSubmit: async () => {
        try {
          if (mode === "edit" && albumId) {
            await GlobalStore.actions.albums.editAlbum({
              albumId: albumId,
              name: values.albumName,
              artworkIds: selectedArtworks.filter((ids) => !selectedArtworksToRemove.includes(ids)),
            })
          } else {
            await GlobalStore.actions.albums.addAlbum({
              name: values.albumName.trim(),
              artworkIds: selectedArtworks,
            })
          }
          navigation.dispatch({
            ...CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "HomeTabs",
                  params: {
                    tabName: "Albums",
                  },
                },
              ],
            }),
          })
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
  const isActionButtonDisabled = () => {
    if (mode === "edit") {
      return (
        selectedArtworksToRemove.length <= 0 &&
        selectedArtworks.length === album?.artworkIds.length &&
        (!isValid || !dirty || isSubmitting)
      )
    } else {
      return selectedArtworks.length <= 0 || !isValid || !dirty || isSubmitting
    }
  }

  return (
    <Flex flex={1} pt={safeAreaInsets.top}>
      <Header label={mode === "edit" ? "Edit Album" : "Create Album"} />
      <Flex px={2} mt={2}>
        <Flex>
          <Input
            title="Album Name"
            onChangeText={handleChange("albumName")}
            onBlur={() => validateForm()}
            defaultValue={values.albumName}
            error={errors.albumName}
          />
        </Flex>
        <Spacer mt={2} />
        <Touchable
          onPress={() => navigation.navigate("CreateOrEditAlbumChooseArtist", { mode, albumId })}
        >
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text>Add Items to Album</Text>
            <ArrowRightIcon fill="black100" />
          </Flex>
        </Touchable>
      </Flex>
      {mode === "edit" ? (
        <Text ml={2} mt={2} variant="xs" color="black60">
          Select artworks to remove from album
        </Text>
      ) : null}
      <MasonryList
        contentContainerStyle={{
          paddingRight: space(2),
          marginTop: space(2),
        }}
        numColumns={2}
        data={selectedArtworks}
        renderItem={({ item: artworkId }) => {
          if (mode === "create") {
            return <ArtworkItem artworkId={artworkId} />
          }
          return (
            <ArtworkItem
              artworkId={artworkId}
              onPress={() => selectArtworkHandler(artworkId)}
              selectedToRemove={selectedArtworksToRemove.includes(artworkId)}
            />
          )
        }}
        keyExtractor={(item) => item}
      />
      <ShadowSeparator />
      <Flex px={2} pt={2} pb={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 2}>
        <Button block onPress={handleSubmit} disabled={isActionButtonDisabled()}>
          {mode === "edit" ? "Save" : "Create"}
        </Button>
      </Flex>
    </Flex>
  )
}
