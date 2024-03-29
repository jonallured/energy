import { fireEvent, waitFor } from "@testing-library/react-native"
import {
  DocumentEntity,
  DocumentGridItem,
} from "components/Items/DocumentGridItem"
import FileViewer from "react-native-file-viewer"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { renderWithWrappers } from "utils/test/renderWithWrappers"

const mockConfigFetch = jest.fn()

describe("DocumentGridItem", () => {
  it("should render info about document", () => {
    const { getByText } = renderWithWrappers(
      <DocumentGridItem document={mockDocument} />
    )

    expect(getByText("File Name")).toBeDefined()
    expect(getByText("1.5mb")).toBeDefined()
  })

  describe("if the file already exists on the user's device", () => {
    xit("should open the file", async () => {
      const { getByText } = renderWithWrappers(
        <DocumentGridItem document={mockDocument} />
      )

      fireEvent.press(getByText("File Name"))

      await waitFor(() =>
        expect(FileViewer.open).toBeCalledWith(
          "path/to/documents/documentId.pdf"
        )
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

      const { getByText } = renderWithWrappers(
        <DocumentGridItem document={mockDocument} />
      )

      fireEvent.press(getByText("File Name"))

      await waitFor(() =>
        expect(mockConfigFetch).toBeCalledWith("GET", "/path/to/file.pdf", {
          "X-ACCESS-TOKEN": "userAccessToken",
        })
      )
    })

    it("should display loading indicator", () => {
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
