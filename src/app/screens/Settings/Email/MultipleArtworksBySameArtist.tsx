import { Input, Text } from "@artsy/palette-mobile"
import { GlobalStore } from "app/system/store/GlobalStore"
import { Screen } from "palette"

export const MultipleArtworksBySameArtist = () => {
  const value = GlobalStore.useAppState((state) => state.email.multipleArtworksBySameArtistSubject)

  return (
    <Screen>
      <Screen.Header title="Subject lines" />
      <Screen.Body>
        <Text my={1}>Multiple artworks by the same artist</Text>
        <Input
          multiline
          value={value}
          onChangeText={(e) => GlobalStore.actions.email.setMultipleArtworksBySameArtistSubject(e)}
        />
        <Text m={1} color="onBackgroundMedium">
          $artist will be replaced by the name of the artist
        </Text>
      </Screen.Body>
    </Screen>
  )
}
