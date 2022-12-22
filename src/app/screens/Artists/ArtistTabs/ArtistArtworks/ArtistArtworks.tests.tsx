import { renderWithWrappers } from "app/utils/test/renderWithWrappers"
import { range } from "lodash"
import { __globalStoreTestUtils__ } from "app/system/store/GlobalStore"
import { mockEnvironmentPayload } from "app/utils/test/mockEnvironmentPayload"
import { ArtistArtworks } from "./ArtistArtworks"

jest.mock("react-native-collapsible-tab-view", () => ({
  ...jest.requireActual("react-native-collapsible-tab-view"),
  useFocusedTab: () => "Wow",
}))

describe("ArtistArtworks", () => {
  it("renders the list of works", async () => {
    const { getByTestId } = renderWithWrappers(<ArtistArtworks slug="some" />)
    await mockEnvironmentPayload(mockProps)
    expect(getByTestId("artist-artwork-list").props.data).toHaveLength(10)
  })

  describe("show/hide artworks based on presentation mode settings", () => {
    it("should NOT HIDE the artworks if 'Presantation Mode' = OFF and 'Hide Work sNot For Sale' switch = OFF", async () => {
      const { getByTestId } = renderWithWrappers(<ArtistArtworks slug="slug" />)
      __globalStoreTestUtils__?.injectState({
        presentationMode: {
          isPresentationModeEnabled: false,
          isHideWorksNotForSaleEnabled: false,
        },
      })
      await mockEnvironmentPayload(newMockProps)
      expect(getByTestId("artist-artwork-list").props.data).toHaveLength(4)
    })

    it("should NOT HIDE the artworks if 'Presantation Mode' = OFF", async () => {
      const { getByTestId } = renderWithWrappers(<ArtistArtworks slug="slug" />)
      __globalStoreTestUtils__?.injectState({
        presentationMode: {
          isPresentationModeEnabled: false,
          isHideWorksNotForSaleEnabled: true,
          isHideUnpublishedWorksEnabled: true,
        },
      })
      await mockEnvironmentPayload(newMockProps)
      expect(getByTestId("artist-artwork-list").props.data).toHaveLength(4)
    })

    describe("if Presentation mode is ON ", () => {
      it("should NOT HIDE the artworks if 'Hide Works Not For Sale' switch = OFF and 'Hide Unpublished Works' switch = OFF ", async () => {
        const { queryByText } = renderWithWrappers(<ArtistArtworks slug="slug" />)
        __globalStoreTestUtils__?.injectState({
          presentationMode: {
            isPresentationModeEnabled: true,
            isHideWorksNotForSaleEnabled: false,
            isHideUnpublishedWorksEnabled: false,
          },
        })
        await mockEnvironmentPayload(newMockProps)
        expect(queryByText("Date of not for sale and unpublished artwork")).toBeTruthy()
        expect(queryByText("Date of artwork on sale but unpublished")).toBeTruthy()
        expect(queryByText("Date of not for sale and published artwork")).toBeTruthy()
        expect(queryByText("Date of artwork on sale and published")).toBeTruthy()
      })
    })

    it("should HIDE the artworks not for sale if 'Hide Works Not For Sale' switch = ON ", async () => {
      const { queryByText } = renderWithWrappers(<ArtistArtworks slug="slug" />)
      __globalStoreTestUtils__?.injectState({
        presentationMode: {
          isPresentationModeEnabled: true,
          isHideWorksNotForSaleEnabled: true,
          isHideUnpublishedWorksEnabled: false,
        },
      })
      await mockEnvironmentPayload(newMockProps)
      expect(queryByText("Date of not for sale and unpublished artwork")).toBeFalsy()
      expect(queryByText("Date of artwork on sale but unpublished")).toBeTruthy()
      expect(queryByText("Date of not for sale and published artwork")).toBeFalsy()
      expect(queryByText("Date of artwork on sale and published")).toBeTruthy()
    })

    it("should HIDE the unpublished artworks if 'Hide Unpublished Works' switch = ON ", async () => {
      const { queryByText } = renderWithWrappers(<ArtistArtworks slug="slug" />)
      __globalStoreTestUtils__?.injectState({
        presentationMode: {
          isPresentationModeEnabled: true,
          isHideWorksNotForSaleEnabled: false,
          isHideUnpublishedWorksEnabled: true,
        },
      })
      await mockEnvironmentPayload(newMockProps)
      expect(queryByText("Date of not for sale and unpublished artwork")).toBeFalsy()
      expect(queryByText("Date of artwork on sale but unpublished")).toBeFalsy()
      expect(queryByText("Date of not for sale and published artwork")).toBeTruthy()
      expect(queryByText("Date of artwork on sale and published")).toBeTruthy()
    })

    it("should HIDE artworks not for sale and unpublished artworks if 'Hide Works Not For Sale' switch = ON and 'Hide Unpublished Works' switch = ON ", async () => {
      const { queryByText } = renderWithWrappers(<ArtistArtworks slug="slug" />)
      __globalStoreTestUtils__?.injectState({
        presentationMode: {
          isPresentationModeEnabled: true,
          isHideUnpublishedWorksEnabled: true,
          isHideWorksNotForSaleEnabled: true,
        },
      })
      await mockEnvironmentPayload(newMockProps)
      expect(queryByText("Date of not for sale and unpublished artwork")).toBeFalsy()
      expect(queryByText("Date of artwork on sale but unpublished")).toBeFalsy()
      expect(queryByText("Date of not for sale and published artwork")).toBeFalsy()
      expect(queryByText("Date of artwork on sale and published")).toBeTruthy()
    })
  })
})

const mockProps = {
  Partner: () => ({
    artworksConnection: {
      edges: range(10).map((i) => ({
        node: {
          internalID: `some-id-${i}`,
          title: "Title",
          date: "2022",
          image: {
            url: "some-url",
            aspectRatio: 1,
          },
          published: false,
        },
      })),
    },
  }),
}

const newMockProps = {
  Partner: () => ({
    artworksConnection: {
      edges: [
        {
          node: {
            date: "Date of not for sale and unpublished artwork",
            image: {
              url: "some-url",
              aspectRatio: 1,
            },
            published: false,
            availability: "Sold",
          },
        },
        {
          node: {
            date: "Date of not for sale and published artwork",
            image: {
              url: "some-url",
              aspectRatio: 1,
            },

            published: true,
            availability: "Sold",
          },
        },
        {
          node: {
            date: "Date of artwork on sale but unpublished",
            image: {
              url: "some-url",
              aspectRatio: 1,
            },
            published: false,
            availability: "for sale",
          },
        },
        {
          node: {
            date: "Date of artwork on sale and published",
            image: {
              url: "some-url",
              aspectRatio: 1,
            },
            published: true,
            availability: "for sale",
          },
        },
      ],
    },
  }),
}
