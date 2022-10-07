import { ScrollView } from "react-native"
import { Header } from "app/sharedUI"
import { SwitchContainer } from "app/sharedUI/molecules/SwitchContainer"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex, Separator, Text } from "palette"
import { Spacer } from "@artsy/palette-mobile"

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
    <>
      <Header label="Edit Presentation Mode" safeAreaInsets />
      <ScrollView>
        <Spacer m={1} />
        {presentationConfigs.map((presentationConfig, index, row) => (
          <Flex key={index}>
            <SwitchContainer
              label={presentationConfig.label}
              onValueChange={presentationConfig.toggleHandler}
              value={presentationConfig.state}
            />
            {index + 1 !== row.length && <Separator m={2} />}
          </Flex>
        ))}
        <Spacer m={2} />
        <Text mx={2} variant="xs">
          When Presentation Mode is enabled, all the information and features toggled ON will be
          hidden. Features toggled OFF will be visible.
        </Text>
      </ScrollView>
    </>
  )
}
