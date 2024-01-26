import { Input, Screen, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"

export const MultipleArtworksAndArtists = () => {
  useTrackScreen("EmailSettingsMultipleArtworksAndArtists")

  const navigation = useNavigation()
  const value = GlobalStore.useAppState((state) => state.email.multipleArtworksAndArtistsSubject)

  return (
    <Screen>
      <Screen.Header title="Subject lines" onBack={navigation.goBack} />
      <Screen.Body>
        <Text my={1}>Multiple artworks and artists</Text>
        <Input
          multiline
          value={value}
          onChangeText={(e) => GlobalStore.actions.email.setMultipleArtworksAndArtistsSubject(e)}
        />
      </Screen.Body>
    </Screen>
  )
}
