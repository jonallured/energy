import { screen, waitFor } from "@testing-library/react-native"
import { ArtworkContentTestQuery } from "__generated__/ArtworkContentTestQuery.graphql"
import {
  ArtworkContent,
  getEditionSetInfo,
} from "apps/Artwork/routes/Artwork/ArtworkContent/ArtworkContent"
import { graphql } from "react-relay"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { setupTestWrapper } from "utils/test/setupTestWrapper"

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}))

describe("ArtworkContent", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkContentTestQuery>({
    Component: (props) => <ArtworkContent slug="foo" {...props} />,
    query: graphql`
      query ArtworkContentTestQuery {
        artwork(id: "foo") {
          ...ArtworkContent_artwork
        }
      }
    `,
  })

  it("renders without throwing an error", async () => {
    renderWithRelay({
      Artwork: () => ({
        provenance: "some provenance",
        price: "some price",
        medium: "some medium",
        internalDisplayPrice: "internal display price",
        editionSets: [],
      }),
    })

    await waitFor(() => {
      expect(screen.queryByText("some provenance")).toBeTruthy()
      expect(screen.queryByText("internal display price")).toBeTruthy()
      expect(screen.queryByText("some medium")).toBeTruthy()
    })
  })

  describe("Price display ", () => {
    it("should display internal display price if available and not price", async () => {
      renderWithRelay({
        Artwork: () => ({
          price: "some price",
          internalDisplayPrice: "internal display price",
          editionSets: [],
        }),
      })

      await waitFor(() => {
        expect(screen.queryByText("internal display price")).toBeTruthy()
        expect(screen.queryByText("some price")).toBeFalsy()
      })
    })

    it("should display internal display price if available and not parent price", async () => {
      renderWithRelay({
        Artwork: () => ({
          price: "some price",
          internalDisplayPrice: null,
          editionSets: [],
        }),
      })

      await waitFor(() => {
        expect(screen.queryByText("internal display price")).toBeFalsy()
        expect(screen.queryByText("some price")).toBeTruthy()
      })
    })
  })

  describe("Editions set is available ", () => {
    it("it should display details of edition set instead of parent details", async () => {
      renderWithRelay({
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

      await waitFor(() => {
        expect(screen.queryByText("parent price")).toBeFalsy()
        expect(screen.queryByText("parent internalDisplayPrice")).toBeFalsy()
        expect(screen.queryByText("edition 2 price")).toBeFalsy()
        expect(screen.queryByText("parent in")).toBeFalsy()
        expect(
          screen.queryByText("edition 1 internalDisplayPrice")
        ).toBeTruthy()
        expect(screen.queryByText("edition 2 cm")).toBeTruthy()
      })
    })

    it("should only display editions set price if available and not parent price", async () => {
      renderWithRelay({
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

      await waitFor(() => {
        expect(screen.queryByText("parent price")).toBeFalsy()
        expect(screen.queryByText("edition 1 price")).toBeTruthy()
        expect(screen.queryByText("edition 2 price")).toBeTruthy()
      })
    })
  })

  describe("show/hide price based on presentation mode settings", () => {
    it("should not hide the price if the Presantation Mode = OFF and Hide Price switch = OFF", async () => {
      renderWithRelay({
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

      await waitFor(() => {
        expect(screen.queryByText("5000$")).toBeTruthy()
      })
    })

    it("should not hide the price if the Presantation Mode = ON and Hide Price switch = OFF", async () => {
      renderWithRelay({
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

      await waitFor(() => {
        expect(screen.queryByText("5000$")).toBeTruthy()
      })
    })

    describe("For sold works", () => {
      it("should hide the price if the 'Presantation Mode' = ON and 'Hide Price For Sold Works' switch = ON", async () => {
        renderWithRelay({
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

        await waitFor(() => {
          expect(screen.queryByText("5000$")).toBeFalsy()
        })
      })

      it("should NOT hide the price if the 'Presantation Mode' = ON and 'Hide Price For Sold Works' switch = OFF", async () => {
        renderWithRelay({
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

        await waitFor(() => {
          expect(screen.queryByText("5000$")).toBeTruthy()
        })
      })
    })

    describe("For Confidential Notes", () => {
      it("should not hide the Confidential Notes if the Presantation Mode = OFF and Hide Confidential Notes = OFF", async () => {
        renderWithRelay({
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

        await waitFor(() => {
          expect(screen.queryByText("This is love")).toBeTruthy()
        })
      })

      it("should not hide the Confidential Notes if the Presantation Mode = OFF and Hide Confidential Notes = OFF", async () => {
        renderWithRelay({
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

        await waitFor(() => {
          expect(screen.queryByText("This is love")).toBeFalsy()
        })
      })
    })
  })
})

describe("getEditionSetInfo", () => {
  it("returns null if artwork has no editionSets", () => {
    const artwork = { editionSets: undefined } as unknown as SelectedItemArtwork

    expect(getEditionSetInfo(artwork)).toBeNull()
  })

  it("returns null if editionSet is null", () => {
    const artwork = { editionSets: null } as unknown as SelectedItemArtwork

    expect(getEditionSetInfo(artwork)).toEqual(null)
  })

  it("returns edition set info with saleMessage and price", () => {
    const artwork = {
      editionSets: [
        {
          saleMessage: "Sale",
          price: 100,
          internalDisplayPrice: 90,
          dimensions: { in: 10, cm: 25 },
          editionOf: 50,
        },
      ],
      availability: "available",
    } as unknown as SelectedItemArtwork

    expect(getEditionSetInfo(artwork)).toEqual([
      {
        saleMessage: "Sale",
        price: 90,
        dimensions: { in: 10, cm: 25 },
        editionOf: 50,
      },
    ])
  })

  it("returns edition set info with null saleMessage if saleMessage equals price", () => {
    const artwork = {
      editionSets: [
        {
          saleMessage: 100,
          price: 100,
          internalDisplayPrice: null,
          dimensions: { in: 10, cm: 25 },
          editionOf: 50,
        },
      ],
      availability: "available",
    } as unknown as SelectedItemArtwork

    expect(getEditionSetInfo(artwork)).toEqual([
      {
        saleMessage: null,
        price: 100,
        dimensions: { in: 10, cm: 25 },
        editionOf: 50,
      },
    ])
  })

  it("returns edition set info with null price if availability is sold", () => {
    const artwork = {
      editionSets: [
        {
          saleMessage: "Sale",
          price: 100,
          internalDisplayPrice: 90,
          dimensions: { in: 10, cm: 25 },
          editionOf: 50,
        },
      ],
      availability: "sold",
    } as unknown as SelectedItemArtwork

    expect(getEditionSetInfo(artwork)).toEqual([
      {
        saleMessage: "Sale",
        price: null,
        dimensions: { in: 10, cm: 25 },
        editionOf: 50,
      },
    ])
  })

  it("returns edition set info with internalDisplayPrice if not null", () => {
    const artwork = {
      editionSets: [
        {
          saleMessage: "Sale",
          price: 100,
          internalDisplayPrice: 500,
          dimensions: { in: 10, cm: 25 },
          editionOf: 50,
        },
      ],
      availability: "available",
    } as unknown as SelectedItemArtwork

    expect(getEditionSetInfo(artwork)).toEqual([
      {
        saleMessage: "Sale",
        price: 500,
        dimensions: { in: 10, cm: 25 },
        editionOf: 50,
      },
    ])
  })

  it("returns edition set info with null price if price is null", () => {
    const artwork = {
      editionSets: [
        {
          saleMessage: "Sale",
          price: null,
          internalDisplayPrice: null,
          dimensions: { in: 10, cm: 25 },
          editionOf: 50,
        },
      ],
      availability: "available",
    } as unknown as SelectedItemArtwork

    expect(getEditionSetInfo(artwork)).toEqual([
      {
        saleMessage: "Sale",
        price: null,
        dimensions: { in: 10, cm: 25 },
        editionOf: 50,
      },
    ])
  })

  it("returns edition set info with price", () => {
    const artwork = {
      editionSets: [
        {
          saleMessage: "Sale",
          price: 100,
          internalDisplayPrice: null,
          dimensions: { in: 10, cm: 25 },
          editionOf: 50,
        },
      ],
      availability: "available",
    } as unknown as SelectedItemArtwork

    expect(getEditionSetInfo(artwork)).toEqual([
      {
        saleMessage: "Sale",
        price: 100,
        dimensions: { in: 10, cm: 25 },
        editionOf: 50,
      },
    ])
  })
})
