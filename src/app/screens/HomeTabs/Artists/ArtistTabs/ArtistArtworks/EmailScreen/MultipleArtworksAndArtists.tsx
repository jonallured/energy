import { Header } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex, Input, Screen, Text } from "palette"

export const MultipleArtworksAndArtists = () => {
  return (
    <Screen>
      <Screen.RawHeader>
        <Flex flexDirection="row" alignItems="center">
          <Flex width="100%" position="absolute">
            <Text textAlign="center" weight="medium" caps>
              Subject lines
            </Text>
          </Flex>
          <Header />
        </Flex>
      </Screen.RawHeader>
      <Screen.Body>
        <Flex mt={1}>
          <Text my={1} caps>
            Multiple artworks and artists
          </Text>
          <Input
            multiline
            defaultValue={GlobalStore.useAppState(
              (state) => state.email.multipleArtworksAndArtistsSubject
            )}
            onChangeText={(e) => GlobalStore.actions.email.saveMultipleArtworksAndArtistsSubject(e)}
          />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
