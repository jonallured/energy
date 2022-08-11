import { Header } from "app/sharedUI"
import { SwitchContainer } from "app/sharedUI/molecules/SwitchContainer"
import { GlobalStore } from "app/store/GlobalStore"
import { Separator, Spacer, Text } from "palette"

export const EditPresentationMode = () => {
  const isHidePriceEnabled = GlobalStore.useAppState(
    (state) => state.presentationMode.isHidePriceEnabled
  )
  const isHideWorksAvailabilityEnabled = GlobalStore.useAppState(
    (state) => state.presentationMode.isHideWorksAvailabilityEnabled
  )
  const isHideConfidentialNotesEnabled = GlobalStore.useAppState(
    (state) => state.presentationMode.isHideConfidentialNotesEnabled
  )
  const isHideArtworkEditButtonEnabled = GlobalStore.useAppState(
    (state) => state.presentationMode.isHideArtworkEditButtonEnabled
  )

  return (
    <>
      <Header label="Edit Presentation Mode" />
      <Spacer m={1} />
      <SwitchContainer
        label="Hide Prices"
        onValueChange={() => GlobalStore.actions.presentationMode.toggleIsHidePriceEnabled()}
        value={isHidePriceEnabled}
      />
      <Spacer m={1} />
      <Separator />
      <Spacer m={1} />
      <SwitchContainer
        label="Hide Works Availability"
        onValueChange={() =>
          GlobalStore.actions.presentationMode.toggleIsHideWorksAvailabilityEnabled()
        }
        value={isHideWorksAvailabilityEnabled}
      />
      <Spacer m={1} />
      <Separator />
      <Spacer m={1} />
      <SwitchContainer
        label="Hide Confidential Notes"
        onValueChange={() =>
          GlobalStore.actions.presentationMode.toggleIsHideConfidentialNotesEnabled()
        }
        value={isHideConfidentialNotesEnabled}
      />
      <Spacer m={1} />
      <Separator />
      <Spacer m={1} />
      <SwitchContainer
        label="Hide Artwork Edit Button"
        onValueChange={() =>
          GlobalStore.actions.presentationMode.toggleIsHideArtworkEditButtonEnabled()
        }
        value={isHideArtworkEditButtonEnabled}
      />
      <Spacer m={2} />
      <Text mx={2} variant="xs">
        When Presentation Mode is enabled, all the information and features toggled ON will be
        hidden. Features toggled OFF will be visible.
      </Text>
    </>
  )
}
