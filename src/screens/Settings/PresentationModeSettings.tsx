import { Flex, Spacer, Screen, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { SettingsItem } from "components/SettingsItem"
import { useAppTracking } from "system/hooks/useAppTracking"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"

export const PresentationModeSettings = () => {
  useTrackScreen("PresentationModeSettings")

  const { trackToggledPresentationViewSetting } = useAppTracking()
  const navigation = useNavigation()

  const isPresentationModeEnabled = GlobalStore.useAppState(
    (state) => state.presentationMode.isPresentationModeEnabled
  )

  const trackToggle = (props: { label: string; value: boolean; toggleHandler: () => void }) => {
    trackToggledPresentationViewSetting(props.label, !props.value)
    props.toggleHandler()
  }

  const presentationConfigs = [
    {
      label: "Hide Prices",
      value: GlobalStore.useAppState((state) => state.presentationMode.isHidePriceEnabled),
      toggleHandler: () => {
        GlobalStore.actions.presentationMode.toggleIsHidePriceEnabled()
      },
    },
    {
      label: "Hide Price For Sold Works",
      value: GlobalStore.useAppState(
        (state) => state.presentationMode.isHidePriceForSoldWorksEnabled
      ),
      toggleHandler: () => {
        GlobalStore.actions.presentationMode.toggleIsHidePriceForSoldWorksEnabled()
      },
    },
    {
      label: "Hide Unpublished Works",
      value: GlobalStore.useAppState(
        (state) => state.presentationMode.isHideUnpublishedWorksEnabled
      ),
      toggleHandler: () => {
        GlobalStore.actions.presentationMode.toggleIsHideUnpublishedWorksEnabled()
      },
    },
    {
      label: "Hide Works Not For Sale",
      value: GlobalStore.useAppState(
        (state) => state.presentationMode.isHideWorksNotForSaleEnabled
      ),
      toggleHandler: () => {
        GlobalStore.actions.presentationMode.toggleIsHideWorksNotForSaleEnabled()
      },
    },
    {
      label: "Hide Works Availability",
      value: GlobalStore.useAppState(
        (state) => state.presentationMode.isHideWorksAvailabilityEnabled
      ),
      toggleHandler: () => {
        GlobalStore.actions.presentationMode.toggleIsHideWorksAvailabilityEnabled()
      },
    },
    {
      label: "Hide Confidential Notes",
      value: GlobalStore.useAppState(
        (state) => state.presentationMode.isHideConfidentialNotesEnabled
      ),
      toggleHandler: () => {
        GlobalStore.actions.presentationMode.toggleIsHideConfidentialNotesEnabled()
      },
    },
    {
      label: "Hide Artwork Edit Button",
      value: GlobalStore.useAppState(
        (state) => state.presentationMode.isHideArtworkEditButtonEnabled
      ),
      toggleHandler: () => {
        GlobalStore.actions.presentationMode.toggleIsHideArtworkEditButtonEnabled()
      },
    },
  ]

  return (
    <Screen>
      <Screen.Header onBack={navigation.goBack} />
      <Screen.Body scroll>
        <Text variant="lg-display" my={1}>
          Presentation Mode
        </Text>

        <SettingsItem title="Enabled">
          <SettingsItem.Toggle
            value={isPresentationModeEnabled}
            onValueChange={() =>
              GlobalStore.actions.presentationMode.toggleIsPresentationModeEnabled()
            }
          />
        </SettingsItem>

        {presentationConfigs.map((presentationConfig, index) => (
          <Flex key={index}>
            <SettingsItem title={presentationConfig.label}>
              <SettingsItem.Toggle
                value={presentationConfig.value}
                onValueChange={() => {
                  trackToggle({
                    label: presentationConfig.label,
                    value: presentationConfig.value,
                    toggleHandler: presentationConfig.toggleHandler,
                  })
                }}
              />
            </SettingsItem>
          </Flex>
        ))}
        <Spacer y={2} />
        <Text variant="xs">
          When Presentation Mode is enabled, all the information and features toggled ON will be
          hidden. Features toggled OFF will be visible.
        </Text>
      </Screen.Body>
    </Screen>
  )
}
