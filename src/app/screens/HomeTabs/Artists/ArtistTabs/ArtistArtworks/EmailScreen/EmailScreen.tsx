import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { ArrowRightIcon, Flex, Input, Screen, Separator, Spacer, Text, Touchable } from "palette"

export const EmailScreen = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()

  return (
    <Screen>
      <Screen.RawHeader>
        <Flex flexDirection="row" alignItems="center">
          <Flex width="100%" position="absolute">
            <Text textAlign="center" weight="medium">
              EMAIL
            </Text>
          </Flex>
          <Header />
        </Flex>
      </Screen.RawHeader>
      <Screen.Body scroll>
        <Flex>
          <Text my={1}>CC EMAIL</Text>
          <Input
            defaultValue={GlobalStore.useAppState((state) => state.email.emailsCC)}
            onChangeText={(e) => GlobalStore.actions.email.saveEmailsCC(e)}
          />
          <Text my={1} mt={2} mb={1}>
            GREETING
          </Text>
          <Input
            multiline
            defaultValue={GlobalStore.useAppState((state) => state.email.greetings)}
            onChangeText={(e) => GlobalStore.actions.email.saveGreetings(e)}
          />
          <Text my={1} mt={2} mb={1}>
            SIGNATURE
          </Text>
          <Input
            multiline
            defaultValue={GlobalStore.useAppState((state) => state.email.signature)}
            onChangeText={(e) => GlobalStore.actions.email.saveSignature(e)}
          />
          <Text my={1} mt={2} mb={1} color="onBackgroundMedium">
            This signature will be displayed together with any signature you specified in your iOS
            Mail settings.
          </Text>
          <Text my={1} mt={2} mb={1}>
            SUBJECT LINES
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
        <Spacer m={6} />
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
