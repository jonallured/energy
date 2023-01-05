import { ArtworkContentQuery } from "__generated__/ArtworkContentQuery.graphql"
import { ArtworkContent } from "app/screens/Artwork/ArtworkContent/ArtworkContent"
import { __globalStoreTestUtils__ } from "app/system/store/GlobalStore"
import { setupTestWrapper } from "app/utils/test/setupTestWrapper"

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}))

describe("ArtworkContent", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkContentQuery>({
    Component: () => <ArtworkContent slug="foo" />,
  })

  it("renders without throwing an error", async () => {
    const { queryByText } = await renderWithRelay({
      Artwork: () => ({
        provenance: "some provenance",
        price: "some price",
        medium: "some medium",
        internalDisplayPrice: "internal display price",
        editionSets: [],
      }),
    })

    expect(queryByText("some provenance")).toBeTruthy()
    expect(queryByText("internal display price")).toBeTruthy()
    expect(queryByText("some medium")).toBeTruthy()
  })

  describe("Price display ", () => {
    it("should display internal display price if available and not price", async () => {
      const { queryByText } = await renderWithRelay({
        Artwork: () => ({
          price: "some price",
          internalDisplayPrice: "internal display price",
          editionSets: [],
        }),
      })

      expect(queryByText("internal display price")).toBeTruthy()
      expect(queryByText("some price")).toBeFalsy()
    })

    it("should display internal display price if available and not parent price", async () => {
      const { queryByText } = await renderWithRelay({
        Artwork: () => ({
          price: "some price",
          internalDisplayPrice: null,
          editionSets: [],
        }),
      })

      expect(queryByText("internal display price")).toBeFalsy()
      expect(queryByText("some price")).toBeTruthy()
    })
  })

  describe("Editions set is available ", () => {
    it("it should display details of edition set instead of parent details", async () => {
      const { queryByText } = await renderWithRelay({
        Artwork: () => ({
          price: "parent price",
          internalDisplayPrice: "parent internalDisplayPrice",
          dimensions: {
            cm: "parent cm",
            in: "parent in",
          },
          editionSets: [
            {
              price: "edition 1 price",
              internalDisplayPrice: "edition 1 internalDisplayPrice",
              dimensions: {
                cm: "edition 1 cm",
                in: "edition 1 in",
              },
            },
            {
              price: "edition 2 price",
              internalDisplayPrice: "edition 2 internalDisplayPrice",
              dimensions: {
                cm: "edition 2 cm",
                in: "edition 2 in",
              },
            },
          ],
        }),
      })

      expect(queryByText("parent price")).toBeFalsy()
      expect(queryByText("parent internalDisplayPrice")).toBeFalsy()
      expect(queryByText("edition 2 price")).toBeFalsy()
      expect(queryByText("parent in")).toBeFalsy()
      expect(queryByText("edition 1 internalDisplayPrice")).toBeTruthy()
      expect(queryByText("edition 2 cm")).toBeTruthy()
    })

    it("should only display editions set price if available and not parent price", async () => {
      const { queryByText } = await renderWithRelay({
        Artwork: () => ({
          price: "parent price",
          internalDisplayPrice: null,
          editionSets: [
            {
              price: "edition 1 price",
              internalDisplayPrice: null,
            },
            {
              price: "edition 2 price",
              internalDisplayPrice: null,
            },
          ],
        }),
      })

      expect(queryByText("parent price")).toBeFalsy()
      expect(queryByText("edition 1 price")).toBeTruthy()
      expect(queryByText("edition 2 price")).toBeTruthy()
    })
  })

  describe("show/hide price based on presentation mode settings", () => {
    it("should not hide the price if the Presantation Mode = OFF and Hide Price switch = OFF", async () => {
      const { queryByText } = await renderWithRelay({
        Artwork: () => ({
          price: "5000$",
          internalDisplayPrice: null,
          editionSets: [],
        }),
      })

      __globalStoreTestUtils__?.injectState({
        presentationMode: {
          isPresentationModeEnabled: false,
          isHidePriceEnabled: false,
        },
      })

      expect(queryByText("5000$")).toBeTruthy()
    })

    it("should not hide the price if the Presantation Mode = ON and Hide Price switch = OFF", async () => {
      const { queryByText } = await renderWithRelay({
        Artwork: () => ({
          price: "5000$",
          internalDisplayPrice: null,
          editionSets: [],
        }),
      })

      __globalStoreTestUtils__?.injectState({
        presentationMode: {
          isPresentationModeEnabled: true,
          isHidePriceEnabled: false,
        },
      })

      expect(queryByText("5000$")).toBeTruthy()
    })

    describe("For sold works", () => {
      it("should hide the price if the 'Presantation Mode' = ON and 'Hide Price For Sold Works' switch = ON", async () => {
        const { queryByText } = await renderWithRelay({
          Artwork: () => ({
            price: "5000$",
            availability: "sold",
            internalDisplayPrice: null,
            editionSets: [],
          }),
        })

        __globalStoreTestUtils__?.injectState({
          presentationMode: {
            isPresentationModeEnabled: true,
            isHidePriceEnabled: false,
            isHidePriceForSoldWorksEnabled: true,
          },
        })

        expect(queryByText("5000$")).toBeFalsy()
      })

      it("should NOT hide the price if the 'Presantation Mode' = ON and 'Hide Price For Sold Works' switch = OFF", async () => {
        const { queryByText } = await renderWithRelay({
          Artwork: () => ({
            price: "5000$",
            availability: "sold",
            internalDisplayPrice: null,
            editionSets: [],
          }),
        })

        __globalStoreTestUtils__?.injectState({
          presentationMode: {
            isPresentationModeEnabled: true,
            isHidePriceEnabled: false,
            isHidePriceForSoldWorksEnabled: false,
          },
        })

        expect(queryByText("5000$")).toBeTruthy()
      })
    })

    describe("For Confidential Notes", () => {
      it("should not hide the Confidential Notes if the Presantation Mode = OFF and Hide Confidential Notes = OFF", async () => {
        const { queryByText } = await renderWithRelay({
          Artwork: () => ({
            confidentialNotes: "This is love",
          }),
        })

        __globalStoreTestUtils__?.injectState({
          presentationMode: {
            isPresentationModeEnabled: false,
            isHideConfidentialNotesEnabled: false,
          },
        })

        expect(queryByText("This is love")).toBeTruthy()
      })

      it("should not hide the Confidential Notes if the Presantation Mode = OFF and Hide Confidential Notes = OFF", async () => {
        const { queryByText } = await renderWithRelay({
          Artwork: () => ({
            confidentialNotes: "This is love",
          }),
        })

        __globalStoreTestUtils__?.injectState({
          presentationMode: {
            isPresentationModeEnabled: true,
            isHideConfidentialNotesEnabled: true,
          },
        })

        expect(queryByText("This is love")).toBeFalsy()
      })
    })
  })
})