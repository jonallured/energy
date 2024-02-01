import {
  Spacer,
  ArrowRightIcon,
  Flex,
  Input,
  Separator,
  Screen,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"

export const EmailSettings = () => {
  useTrackScreen({ name: "EmailSettings", type: "Settings" })

  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const emailCC = GlobalStore.useAppState((state) => state.email.ccRecipients)
  const greeting = GlobalStore.useAppState((state) => state.email.greetings)
  const signature = GlobalStore.useAppState((state) => state.email.signature)

  return (
    <Screen>
      <Screen.Header onBack={navigation.goBack} />
      <Screen.Body scroll>
        <Text variant="lg-display" my={1}>
          Email Settings
        </Text>
        <Flex>
          <Input
            title="CC Email"
            value={emailCC}
            onChangeText={(e) => GlobalStore.actions.email.setCCRecipients(e)}
          />
          <Input
            title="Greeting"
            multiline
            value={greeting}
            onChangeText={(e) => GlobalStore.actions.email.setGreetings(e)}
          />
          <Input
            title="Signature"
            multiline
            value={signature}
            onChangeText={(e) => GlobalStore.actions.email.setSignature(e)}
          />
          <Text mt={2} mb={1} color="onBackgroundMedium">
            This signature will be displayed together with any signature you
            specified in your iOS Mail settings.
          </Text>
          <Text my={1} mt={2} mb={1}>
            Subject lines
          </Text>
          <Separator my={1} />
          <SubjectLineRow
            label="One Artwork"
            navigateTo={() => navigation.navigate("EmailSettingsOneArtwork")}
          />
          <SubjectLineRow
            label="Multiple artworks by the same artist"
            navigateTo={() =>
              navigation.navigate("EmailSettingsMultipleArtworksBySameArtist")
            }
          />
          <SubjectLineRow
            label="Multiple artworks and artists"
            navigateTo={() =>
              navigation.navigate("EmailSettingsMultipleArtworksAndArtists")
            }
          />
        </Flex>
        <Spacer y={6} />
      </Screen.Body>
    </Screen>
  )
}

const SubjectLineRow = ({
  label,
  navigateTo,
}: {
  label: string
  navigateTo: () => void
}) => {
  return (
    <>
      <Touchable onPress={navigateTo}>
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text my={0.5}>{label}</Text>
          <ArrowRightIcon fill="onBackgroundMedium" />
        </Flex>
      </Touchable>
      <Separator my={1} />
    </>
  )
}
