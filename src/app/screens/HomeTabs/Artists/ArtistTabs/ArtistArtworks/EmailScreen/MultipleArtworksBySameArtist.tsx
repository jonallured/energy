import { Header } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex, Input, Screen, Text } from "palette"

export const MultipleArtworksBySameArtist = () => {
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
            Multiple artworks by the same artist
          </Text>
          <Input
            placeholder="More information about $artist's artworks."
            multiline
            onChangeText={(e) =>
              GlobalStore.actions.email.saveMultipleArtworksBySameArtistSubject(e)
            }
          />
          <Text m={1} color="onBackgroundMedium">
            $artist will be replaced by the name of the artist
          </Text>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
