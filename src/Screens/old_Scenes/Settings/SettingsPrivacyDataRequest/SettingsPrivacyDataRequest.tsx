import { LinkText } from "helpers/components/LinkText"
import { Box, Button, Flex, Join, Sans, Separator, Spacer } from "palette"

export const SettingsPrivacyDataRequestScreen = () => {
  return (
    <Flex flex={1} backgroundColor="white">
      <Spacer my={1} />
      <Box mx={2}>
        <Join separator={<Spacer mb={2} />}>
          <Sans size="3" textAlign="left">
            Please see Artsy’s{" "}
            <LinkText
              onPress={() => {
                // navigate to privacy policy in a modal
              }}
            >
              Privacy Policy
            </LinkText>{" "}
            for more information about the information we collect, how we use it, and why we use it.
          </Sans>
          <Sans size="3" textAlign="left">
            To submit a personal data request tap the button below or email{" "}
            <LinkText
              onPress={() => {
                // presentEmailComposer("privacy@artsy.net", "Personal Data Request")
              }}
            >
              privacy@artsy.net.
            </LinkText>{" "}
          </Sans>
          <Button
            variant="fillGray"
            block
            size="large"
            mt={1}
            onPress={() => {
              // presentEmailComposer(
              //   "privacy@artsy.net",
              //   "Personal Data Request",
              //   "Hello, I'm contacting you to ask that..."
              // )
            }}
          >
            Do not sell my personal information
          </Button>
        </Join>
      </Box>
    </Flex>
  )
}
