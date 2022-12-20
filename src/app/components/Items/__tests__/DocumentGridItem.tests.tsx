import { fireEvent, waitFor } from "@testing-library/react-native"
import FileViewer from "react-native-file-viewer"
import RNFetchBlob from "rn-fetch-blob"
import { DocumentEntity, DocumentGridItem } from "app/components/Items/DocumentGridItem"
import { __globalStoreTestUtils__ } from "app/system/store/GlobalStore"
import { renderWithWrappers } from "app/utils/test/renderWithWrappers"

const mockConfigFetch = jest.fn()

jest.mock("rn-fetch-blob", () => ({
  config: () => ({
    fetch: mockConfigFetch,
  }),
  fs: {
    exists: jest.fn(),
    dirs: {
      DocumentDir: "path/to/documents",
    },
  },
}))

describe("DocumentGridItem", () => {
  const mockExists = RNFetchBlob.fs.exists as jest.Mock

  beforeEach(() => {
    mockExists.mockImplementation(() => false)
  })

  it("should render info about document", () => {
    const { getByText } = renderWithWrappers(<DocumentGridItem document={mockDocument} />)

    expect(getByText("File Name")).toBeDefined()
    expect(getByText("1.5mb")).toBeDefined()
  })

  describe("if the file already exists on the user's device", () => {
    xit("should open the file", async () => {
      mockExists.mockImplementation(() => true)
      const { getByText } = renderWithWrappers(<DocumentGridItem document={mockDocument} />)

      fireEvent.press(getByText("File Name"))

      await waitFor(() =>
        expect(FileViewer.open).toBeCalledWith("path/to/documents/documentId.pdf")
      )
    })
  })

  describe("when the file is not on the user's device", () => {
    xit("should download the file", async () => {
      __globalStoreTestUtils__?.injectState({
        auth: {
          userAccessToken: "userAccessToken",
        },
      })

      const { getByText } = renderWithWrappers(<DocumentGridItem document={mockDocument} />)

      fireEvent.press(getByText("File Name"))

      await waitFor(() =>
        expect(mockConfigFetch).toBeCalledWith("GET", "/path/to/file.pdf", {
          "X-ACCESS-TOKEN": "userAccessToken",
        })
      )
    })

    xit("should display loading indicator", () => {
      const { getByText, queryByText, queryByLabelText } = renderWithWrappers(
        <DocumentGridItem document={mockDocument} />
      )

      fireEvent.press(getByText("File Name"))

      expect(queryByLabelText("Loading Indicator")).toBeDefined()
      expect(queryByText("Cancel")).toBeDefined()
    })
  })
})

const mockDocument: DocumentEntity = {
  id: "documentId",
  url: "/path/to/file.pdf",
  size: 1572864, // 1.5 mb
  title: "File Name",
}
