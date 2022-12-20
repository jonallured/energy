import { screen } from "@testing-library/react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtworkGridItem_artwork_TestQuery } from "__generated__/ArtworkGridItem_artwork_TestQuery.graphql"
import { ArtworkGridItem } from "app/components/Items/ArtworkGridItem"
import { __globalStoreTestUtils__ } from "app/system/store/GlobalStore"
import { mockEnvironmentPayload } from "app/utils/test/mockEnvironmentPayload"
import { renderWithWrappers } from "app/utils/test/renderWithWrappers"

describe("ArtworkGridItem", () => {
  const TestRenderer = () => {
    const data = useLazyLoadQuery<ArtworkGridItem_artwork_TestQuery>(
      graphql`
        query ArtworkGridItem_artwork_TestQuery @relay_test_operation {
          artwork(id: "some-id") {
            ...ArtworkGridItem_artwork
          }
        }
      `,
      {}
    )

    return <ArtworkGridItem artwork={data.artwork!} />
  }

  it("should NOT HIDE the availabilty status dot if the 'Presantation Mode = OFF' ", async () => {
    renderWithWrappers(<TestRenderer />)

    __globalStoreTestUtils__?.injectState({
      presentationMode: {
        isPresentationModeEnabled: false,
        isHideWorksAvailabilityEnabled: false,
      },
    })

    await mockEnvironmentPayload({
      Artwork: () => ({
        availability: "for sale",
      }),
    })

    expect(screen.queryByTestId("availability-dot")).toBeTruthy()
  })

  it("should NOT HIDE the availabilty status dot if the 'Presantation Mode = ON' and 'Hide Works Availability' switch = OFF", async () => {
    renderWithWrappers(<TestRenderer />)

    __globalStoreTestUtils__?.injectState({
      presentationMode: {
        isPresentationModeEnabled: true,
        isHideWorksAvailabilityEnabled: false,
      },
    })

    await mockEnvironmentPayload({
      Artwork: () => ({
        availability: "for sale",
      }),
    })

    expect(screen.queryByTestId("availability-dot")).toBeTruthy()
  })

  it("should HIDE the availabilty status dot if the 'Presantation Mode = ON' and 'Hide Works Availability' switch = ON", async () => {
    renderWithWrappers(<TestRenderer />)

    __globalStoreTestUtils__?.injectState({
      presentationMode: {
        isPresentationModeEnabled: true,
        isHideWorksAvailabilityEnabled: true,
      },
    })

    await mockEnvironmentPayload({
      Artwork: () => ({
        availability: "for sale",
      }),
    })

    expect(screen.queryByTestId("availability-dot")).toBeFalsy()
  })
})
