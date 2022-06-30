import { CommonActions, NavigationProp, useNavigation } from "@react-navigation/native"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Button,
  Flex,
  Input,
  Spacer,
  ShadowSeparator,
  Text,
  Touchable,
} from "palette"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { GlobalStore } from "app/store/GlobalStore"
import { useFormik } from "formik"
import * as Yup from "yup"
import uuid from "react-native-uuid"
import { DateTime } from "luxon"
import { useState } from "react"

interface CreateAlbumValuesSchema {
  albumName: string
}

const createAlbumSchema = Yup.object().shape({
  albumName: Yup.string().required("Album name is required"),
})

export const CreateAlbum = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const insets = useSafeAreaInsets()
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
            artworkIds: [],
            createdAt: DateTime.now().toISO(),
          })
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
    <>
      <Flex flex={1} pt={insets.top} px={2} mt={2}>
        <Touchable
          onPress={() => {
            navigation.goBack()
          }}
        >
          <ArrowLeftIcon fill="black100" />
        </Touchable>
        <Flex mt={2} flex={1}>
          <Text variant="lg">Create an Album</Text>
          <Spacer mt={2} />
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
          <Flex flexDirection="row" alignItems="center">
            <Text>Add Items to Album</Text>
            <ArrowRightIcon fill="black100" ml="auto" />
          </Flex>
        </Flex>
      </Flex>
      <ShadowSeparator mb={2} />
      <Flex mx={2}>
        <Button block mb={4} onPress={handleSubmit} disabled={!isValid || !dirty || loading}>
          Create
        </Button>
      </Flex>
    </>
  )
}
