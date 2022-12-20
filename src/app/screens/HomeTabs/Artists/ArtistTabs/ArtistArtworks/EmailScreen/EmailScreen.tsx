import {
  Spacer,
  ArrowRightIcon,
  Flex,
  Input,
  Separator,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "app/Navigation"
import { GlobalStore } from "app/system/store/GlobalStore"
import { Screen } from "palette"

export const EmailScreen = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const emailCC = GlobalStore.useAppState((state) => state.email.emailsCC)
  const greeting = GlobalStore.useAppState((state) => state.email.greetings)
  const signature = GlobalStore.useAppState((state) => state.email.signature)

  return (
    <Screen>
      <Screen.Header title="Email" />
      <Screen.Body scroll>
        <Flex>
          <Input
            title="CC Email"
            value={emailCC}
            onChangeText={(e) => GlobalStore.actions.email.saveEmailsCC(e)}
          />
          <Input
            title="Greeting"
            multiline
            value={greeting}
            onChangeText={(e) => GlobalStore.actions.email.saveGreetings(e)}
          />
          <Input
            title="Signature"
            multiline
            value={signature}
            onChangeText={(e) => GlobalStore.actions.email.saveSignature(e)}
          />
          <Text mt={2} mb={1} color="onBackgroundMedium">
            This signature will be displayed together with any signature you specified in your iOS
            Mail settings.
          </Text>
          <Text my={1} mt={2} mb={1}>
            Subject lines
          </Text>
          <Separator my={1} />
          <SubjectLineRow
            label="One Artwork"
            navigateTo={() => navigation.navigate("OneArtwork")}
          />
          <SubjectLineRow
            label="Multiple artworks by the same artist"
            navigateTo={() => navigation.navigate("MultipleArtworksBySameArtist")}
          />
          <SubjectLineRow
            label="Multiple artworks and artists"
            navigateTo={() => navigation.navigate("MultipleArtworksAndArtists")}
          />
        </Flex>
        <Spacer y={6} />
      </Screen.Body>
    </Screen>
  )
}

const SubjectLineRow = ({ label, navigateTo }: { label: string; navigateTo: () => void }) => {
  return (
    <>
      <Touchable onPress={navigateTo}>
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text my={0.5}>{label}</Text>
          <ArrowRightIcon fill="onBackgroundMedium" />
        </Flex>
      </Touchable>
      <Separator my={1} />
    </>
  )
}
