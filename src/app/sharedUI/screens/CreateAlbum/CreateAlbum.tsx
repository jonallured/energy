import { CommonActions, NavigationProp, useNavigation } from "@react-navigation/native"
import { ArrowRightIcon, Button, Flex, Input, Spacer, Text, Touchable } from "palette"
import { ShadowSeparator } from "palette/elements/Separator/ShadowSeparator"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { GlobalStore } from "app/store/GlobalStore"
import { useFormik } from "formik"
import * as Yup from "yup"
import uuid from "react-native-uuid"
import { DateTime } from "luxon"
import { useState } from "react"
import { Header } from "app/sharedUI/Header"
import MasonryList from "@react-native-seoul/masonry-list"
import { ArtworkItem } from "app/sharedUI/items/ArtworkItem"
interface CreateAlbumValuesSchema {
  albumName: string
}

const createAlbumSchema = Yup.object().shape({
  albumName: Yup.string().required("Album name is required"),
})

export const CreateAlbum = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const selectedArtworks = GlobalStore.useAppState(
    (state) => state.albums.sessionState.selectedArtworks
  )

  const safeAreaInsets = useSafeAreaInsets()
  const [loading, setLoading] = useState(false)

  const { handleSubmit, handleChange, values, errors, validateForm, isValid, dirty } =
    useFormik<CreateAlbumValuesSchema>({
      initialValues: {
        albumName: "",
      },
      initialErrors: {},
      onSubmit: async () => {
        try {
          setLoading(false)
          await GlobalStore.actions.albums.addAlbum({
            id: uuid.v4().toString(),
            title: values.albumName.trim(),
            artworkIds: selectedArtworks,
            createdAt: DateTime.now().toISO(),
          })
          await GlobalStore.actions.albums.clearAllSelectedArtworks()
          setLoading(true)
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
          setLoading(true)
          console.error(error)
        }
      },
      validationSchema: createAlbumSchema,
    })

  return (
    <Flex flex={1} pt={safeAreaInsets.top}>
      <Header label="Create an Album" />
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
        <Touchable onPress={() => navigation.navigate("CreateAlbumChooseArtist")}>
          <Flex flexDirection="row" alignItems="center">
            <Text>Add Items to Album</Text>
            <ArrowRightIcon fill="black100" ml="auto" />
          </Flex>
        </Touchable>
      </Flex>
      <MasonryList
        contentContainerStyle={{
          paddingRight: 20,
          marginTop: 20,
        }}
        numColumns={2}
        data={selectedArtworks || []}
        renderItem={({ item: artworkId }) => <ArtworkItem artworkId={artworkId} />}
        keyExtractor={(item) => item}
      />
      <ShadowSeparator />
      <Flex px={2} pt={2} pb={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 2}>
        <Button
          block
          onPress={handleSubmit}
          disabled={selectedArtworks.length <= 0 || !isValid || !dirty || loading}
        >
          Create
        </Button>
      </Flex>
    </Flex>
  )
}
