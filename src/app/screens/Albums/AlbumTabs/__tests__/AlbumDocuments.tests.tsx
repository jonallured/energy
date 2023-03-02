import { screen, waitFor } from "@testing-library/react-native"
import { DocumentGridItem } from "app/components/Items/DocumentGridItem"
import { AlbumDocuments } from "app/screens/Albums/AlbumTabs/AlbumDocuments"
import { __globalStoreTestUtils__ } from "app/system/store/GlobalStore"
import { SelectedItemDocument } from "app/system/store/Models/SelectModeModel"
import { flushPromiseQueue } from "app/utils/test/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/test/setupTestWrapper"

describe("AlbumDocuments", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <AlbumDocuments documentIDs={["1", "2", "3"]} />,
  })

  it("renders correctly", async () => {
    renderWithRelay()
    await waitFor(() => {
      expect(screen.UNSAFE_getAllByType(DocumentGridItem)).toHaveLength(1)
    })
  })

  it("removes documents from the album if they are deleted", async () => {
    const documentToRemove = { internalID: "3" }

    __globalStoreTestUtils__?.injectState({
      albums: {
        albums: [
          {
            id: "test-album-1",
            items: [
              { internalID: "1" },
              { internalID: "2" },
              documentToRemove,
            ] as SelectedItemDocument[],
          },
        ],
      },
    })

    renderWithRelay({
      PartnerDocumentConnection: () => ({
        edges: [
          {
            node: {
              internalID: "1",
            },
          },
          {
            node: {
              internalID: "2",
            },
          },
        ],
      }),
    })

    await waitFor(() => {
      expect(screen.UNSAFE_getAllByType(DocumentGridItem)).toHaveLength(2)
    })

    await flushPromiseQueue()

    __globalStoreTestUtils__?.getCurrentState().albums.albums.forEach((album) => {
      expect(album.items).not.toContain(documentToRemove)
    })
  })
})
