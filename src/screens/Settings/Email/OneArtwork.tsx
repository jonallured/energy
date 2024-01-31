import { Input, Text, Screen } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"

export const OneArtwork = () => {
  useTrackScreen({ name: "EmailSettingsOneArtwork", type: "Settings" })

  const navigation = useNavigation()
  const value = GlobalStore.useAppState((state) => state.email.oneArtworkSubject)

  return (
    <Screen>
      <Screen.Header title="Subject lines" onBack={navigation.goBack} />
      <Screen.Body scroll>
        <Text my={1}>One Artwork</Text>
        <Input
          multiline
          value={value}
          onChangeText={(e) => GlobalStore.actions.email.setOneArtworkSubject(e)}
        />
        <Text mt={1} color="onBackgroundMedium">
          $title and $artist will be replaced by the artwork title and artist
        </Text>
      </Screen.Body>
    </Screen>
  )
}
