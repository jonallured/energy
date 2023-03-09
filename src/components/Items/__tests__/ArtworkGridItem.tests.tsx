import { waitFor } from "@testing-library/react-native"
import { ArtworkGridItem } from "components/Items/ArtworkGridItem"
import { graphql } from "react-relay"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { setupTestWrapper } from "utils/test/setupTestWrapper"

describe("ArtworkGridItem", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArtworkGridItem,
    query: graphql`
      query ArtworkGridItem_artwork_TestQuery @relay_test_operation {
        artwork(id: "some-id") {
          ...ArtworkGridItem_artwork
        }
      }
    `,
  })

  it("should NOT HIDE the availabilty status dot if the 'Presantation Mode = OFF' ", async () => {
    const { queryByTestId } = renderWithRelay({
      Artwork: () => ({
        availability: "for sale",
      }),
    })

    __globalStoreTestUtils__?.injectState({
      presentationMode: {
        isPresentationModeEnabled: false,
        isHideWorksAvailabilityEnabled: false,
      },
    })

    await waitFor(() => {
      expect(queryByTestId("availability-dot")).toBeTruthy()
    })
  })

  it("should NOT HIDE the availabilty status dot if the 'Presantation Mode = ON' and 'Hide Works Availability' switch = OFF", async () => {
    const { queryByTestId } = renderWithRelay({
      Artwork: () => ({
        availability: "for sale",
      }),
    })

    __globalStoreTestUtils__?.injectState({
      presentationMode: {
        isPresentationModeEnabled: true,
        isHideWorksAvailabilityEnabled: false,
      },
    })

    await waitFor(() => {
      expect(queryByTestId("availability-dot")).toBeTruthy()
    })
  })

  it("should HIDE the availabilty status dot if the 'Presantation Mode = ON' and 'Hide Works Availability' switch = ON", async () => {
    const { queryByTestId } = renderWithRelay({
      Artwork: () => ({
        availability: "for sale",
      }),
    })

    __globalStoreTestUtils__?.injectState({
      presentationMode: {
        isPresentationModeEnabled: true,
        isHideWorksAvailabilityEnabled: true,
      },
    })

    await waitFor(() => {
      expect(queryByTestId("availability-dot")).toBeFalsy()
    })
  })
})
