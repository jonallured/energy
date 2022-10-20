import { Input, Text } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { Screen } from "palette"

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
          onChangeText={(e) => GlobalStore.actions.email.saveMultipleArtworksAndArtistsSubject(e)}
        />
      </Screen.Body>
    </Screen>
  )
}
