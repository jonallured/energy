import { Input, Text } from "@artsy/palette-mobile"
import { Screen } from "components/Screen"
import { GlobalStore } from "system/store/GlobalStore"

export const MultipleArtworksAndArtists = () => {
  const value = GlobalStore.useAppState((state) => state.email.multipleArtworksAndArtistsSubject)

  return (
    <Screen>
      <Screen.Header title="Subject lines" />
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
