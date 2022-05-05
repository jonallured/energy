import { MenuItem } from "@helpers/components/MenuItem"
import { SwitchMenu } from "@helpers/components/SwitchMenu"
import { sendEmail } from "@helpers/utils/sendEmail"
import { StackScreenProps } from "@react-navigation/stack"
import { Button, Flex, Join, Separator } from "palette"
import React from "react"
import { Alert, Linking, ScrollView } from "react-native"
import { SettingsScreenStack } from "../Settings"
import { GlobalStore } from "../../../store/GlobalStore"

interface SettingsScreenProps extends StackScreenProps<SettingsScreenStack, "Settings"> {}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const enableDarkMode = false
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40, backgroundColor: "white" }}>
      {/* Reset The Relay  */}
      <Join separator={<Separator />}>
        <MenuItem
          title="Sync content"
          onPress={() => {
            Alert.alert("Not yet implement")
          }}
        />
        <MenuItem
          title="Change Partner"
          onPress={() => {
            Alert.alert("Change Parnter", "Are you sure you want to change partner", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Change partner",
                style: "destructive",
                onPress: () => {
                  GlobalStore.actions.setActivePartnerID(null)
                },
              },
            ])
          }}
        />
        <Separator mb={3} />
        <MenuItem
          title="Presentation Mode"
          onPress={() => {
            navigation.navigate("SettingsPresenterMode")
          }}
        />

        <Flex px={2} pt={1} justifyContent="center">
          <SwitchMenu
            title="Enable Dark Mode 🌒"
            onChange={() => {
              // do nothing
            }}
            description="This feature is still experimental"
            disabled
            value={enableDarkMode}
          />
        </Flex>

        <Separator mb={3} />

        <MenuItem
          title="Support"
          onPress={() => {
            Linking.openURL("https://help.artsy.net/")
          }}
        />
        <MenuItem
          title="Send Feedback"
          onPress={() => {
            sendEmail({ toAddress: "support@artsy.net" })
          }}
        />
        <MenuItem
          title="Personal data request"
          onPress={() => {
            navigation.navigate("SettingsPrivacyDataRequest")
          }}
        />
        <MenuItem
          title="About"
          onPress={() => {
            // navigation.navigate("SettingsAbout")
          }}
        />
      </Join>

      <Flex p={2}>
        <Button
          onPress={() => {
            Alert.alert("Log out", "Are you sure you want to log out", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Log out",
                style: "destructive",
                onPress: () => {
                  GlobalStore.actions.auth.signOut()
                },
              },
            ])
          }}
          block
        >
          Log out
        </Button>
      </Flex>
    </ScrollView>
  )
}
