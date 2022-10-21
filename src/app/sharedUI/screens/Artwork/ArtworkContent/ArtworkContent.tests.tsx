import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "shared/tests/renderWithWrappers"
import { ArtworkContent } from "./ArtworkContent"

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}))

describe("ArtworkContent", () => {
  it("renders without throwing an error", async () => {
    const { queryByText } = renderWithWrappers(<ArtworkContent slug="slug" />)
    await mockEnvironmentPayloadMaybe({
      Artwork: () => ({
        provenance: "some provenance",
        price: "some price",
        medium: "some medium",
      }),
    })

    expect(queryByText("some provenance")).toBeTruthy()
    expect(queryByText("some price")).toBeTruthy()
    expect(queryByText("some medium")).toBeTruthy()
  })

  describe("show/hide price based on presentation mode settings", () => {
    it("should not hide the price if the Presantation Mode = OFF and Hide Price switch = OFF", async () => {
      const { queryByText } = renderWithWrappers(<ArtworkContent slug="slug" />)
      __globalStoreTestUtils__?.injectState({
        presentationMode: {
          isPresentationModeEnabled: false,
          isHidePriceEnabled: false,
        },
      })
      await mockEnvironmentPayloadMaybe({
        Artwork: () => ({
          price: "5000$",
        }),
      })
      expect(queryByText("5000$")).toBeTruthy()
    })

    it("should not hide the price if the Presantation Mode = ON and Hide Price switch = OFF", async () => {
      const { queryByText } = renderWithWrappers(<ArtworkContent slug="slug" />)
      __globalStoreTestUtils__?.injectState({
        presentationMode: {
          isPresentationModeEnabled: true,
          isHidePriceEnabled: false,
        },
      })
      await mockEnvironmentPayloadMaybe({
        Artwork: () => ({
          price: "5000$",
        }),
      })
      expect(queryByText("5000$")).toBeTruthy()
    })

    describe("For sold works", () => {
      it("should hide the price if the 'Presantation Mode' = ON and 'Hide Price For Sold Works' switch = ON", async () => {
        const { queryByText } = renderWithWrappers(<ArtworkContent slug="slug" />)
        __globalStoreTestUtils__?.injectState({
          presentationMode: {
            isPresentationModeEnabled: true,
            isHidePriceEnabled: false,
            isHidePriceForSoldWorksEnabled: true,
          },
        })
        await mockEnvironmentPayloadMaybe({
          Artwork: () => ({
            price: "5000$",
            availability: "sold",
          }),
        })
        expect(queryByText("5000$")).toBeFalsy()
      })

      it("should NOT hide the price if the 'Presantation Mode' = ON and 'Hide Price For Sold Works' switch = OFF", async () => {
        const { queryByText } = renderWithWrappers(<ArtworkContent slug="slug" />)
        __globalStoreTestUtils__?.injectState({
          presentationMode: {
            isPresentationModeEnabled: true,
            isHidePriceEnabled: false,
            isHidePriceForSoldWorksEnabled: false,
          },
        })
        await mockEnvironmentPayloadMaybe({
          Artwork: () => ({
            price: "5000$",
            availability: "sold",
          }),
        })
        expect(queryByText("5000$")).toBeTruthy()
      })
    })

    describe("For Confidential Notes", () => {
      it("should not hide the Confidential Notes if the Presantation Mode = OFF and Hide Confidential Notes = OFF", async () => {
        const { queryByText } = renderWithWrappers(<ArtworkContent slug="slug" />)
        __globalStoreTestUtils__?.injectState({
          presentationMode: {
            isPresentationModeEnabled: false,
            isHideConfidentialNotesEnabled: false,
          },
        })
        await mockEnvironmentPayloadMaybe({
          Artwork: () => ({
            confidentialNotes: "This is love",
          }),
        })
        expect(queryByText("This is love")).toBeTruthy()
      })

      it("should not hide the Confidential Notes if the Presantation Mode = OFF and Hide Confidential Notes = OFF", async () => {
        const { queryByText } = renderWithWrappers(<ArtworkContent slug="slug" />)
        __globalStoreTestUtils__?.injectState({
          presentationMode: {
            isPresentationModeEnabled: true,
            isHideConfidentialNotesEnabled: true,
          },
        })
        await mockEnvironmentPayloadMaybe({
          Artwork: () => ({
            confidentialNotes: "This is love",
          }),
        })
        expect(queryByText("This is love")).toBeFalsy()
      })
    })
  })
})
