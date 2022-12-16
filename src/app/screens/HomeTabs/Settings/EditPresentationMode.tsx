import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { SettingsItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Screen } from "palette"

export const EditPresentationMode = () => {
  const presentationConfigs = [
    {
      label: "Hide Prices",
      state: GlobalStore.useAppState((state) => state.presentationMode.isHidePriceEnabled),
      toggleHandler: () => GlobalStore.actions.presentationMode.toggleIsHidePriceEnabled(),
    },
    {
      label: "Hide Price For Sold Works",
      state: GlobalStore.useAppState(
        (state) => state.presentationMode.isHidePriceForSoldWorksEnabled
      ),
      toggleHandler: () =>
        GlobalStore.actions.presentationMode.toggleIsHidePriceForSoldWorksEnabled(),
    },
    {
      label: "Hide Unpublished Works",
      state: GlobalStore.useAppState(
        (state) => state.presentationMode.isHideUnpublishedWorksEnabled
      ),
      toggleHandler: () =>
        GlobalStore.actions.presentationMode.toggleIsHideUnpublishedWorksEnabled(),
    },
    {
      label: "Hide Works Not For Sale",
      state: GlobalStore.useAppState(
        (state) => state.presentationMode.isHideWorksNotForSaleEnabled
      ),
      toggleHandler: () =>
        GlobalStore.actions.presentationMode.toggleIsHideWorksNotForSaleEnabled(),
    },
    {
      label: "Hide Works Availability",
      state: GlobalStore.useAppState(
        (state) => state.presentationMode.isHideWorksAvailabilityEnabled
      ),
      toggleHandler: () =>
        GlobalStore.actions.presentationMode.toggleIsHideWorksAvailabilityEnabled(),
    },
    {
      label: "Hide Confidential Notes",
      state: GlobalStore.useAppState(
        (state) => state.presentationMode.isHideConfidentialNotesEnabled
      ),
      toggleHandler: () =>
        GlobalStore.actions.presentationMode.toggleIsHideConfidentialNotesEnabled(),
    },
    {
      label: "Hide Artwork Edit Button",
      state: GlobalStore.useAppState(
        (state) => state.presentationMode.isHideArtworkEditButtonEnabled
      ),
      toggleHandler: () =>
        GlobalStore.actions.presentationMode.toggleIsHideArtworkEditButtonEnabled(),
    },
  ]

  return (
    <Screen>
      <Screen.Header title="Edit Presentation Mode" />
      <Screen.Body scroll>
        {presentationConfigs.map((presentationConfig, index) => (
          <Flex key={index}>
            <SettingsItem title={presentationConfig.label}>
              <SettingsItem.Toggle
                value={presentationConfig.state}
                onValueChange={presentationConfig.toggleHandler}
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
