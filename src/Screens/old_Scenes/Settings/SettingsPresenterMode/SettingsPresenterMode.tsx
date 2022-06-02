import { LinkText } from "Screens/old_Scenes/components/LinkText"
import { GlobalStore } from "store/GlobalStore"
import { Box, Button, Flex, Join, RadioButton, Sans, Separator, Spacer, Text } from "palette"
import { useState } from "react"
import { Alert } from "react-native"

export const SettingsPresenterModeScreen = () => {
  const storeActiveMode = GlobalStore.useAppState((state) => state.activeMode)
  const [activeMode, setActiveMode] = useState(storeActiveMode)

  return (
    <Flex flex={1} backgroundColor="white" p={2}>
      <RadioButton
        text="View Mode"
        selected={activeMode === "viewer"}
        onPress={() => {
          setActiveMode("viewer")
        }}
      />
      <Text variant="sm" color="black60">
        In viewer mode, only the home tab is available
      </Text>

      <Separator my={2} />

      <RadioButton
        text="Manager Mode"
        selected={activeMode === "manager"}
        onPress={() => {
          setActiveMode("manager")
        }}
      />

      <Text variant="sm" color="black60">
        Enjoy unrestricted access to all the app features
      </Text>

      <Flex position="absolute" bottom={0} alignSelf="center" m={2}>
        <Button
          onPress={() => {
            if (activeMode === "viewer") {
              GlobalStore.actions.setActiveMode(activeMode)
              return
            }
            Alert.prompt("Manager Mode", "Please type in your password", () => {
              GlobalStore.actions.setActiveMode(activeMode)
            })
          }}
          block
          disabled={storeActiveMode === activeMode}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  )
}
