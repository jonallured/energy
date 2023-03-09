import { FileTypeIcon } from "components/FileTypeIcon"
import { renderWithWrappers } from "utils/test/renderWithWrappers"

describe("FileTypeIcon", () => {
  it("renders acrobat icon, if file type is .pdf", () => {
    const { getByTestId } = renderWithWrappers(<FileTypeIcon fileType="pdf" />)

    expect(getByTestId("acrobat-icon")).toBeDefined()
  })

  it("renders image icon, if file type is .jpg", () => {
    const { getByTestId } = renderWithWrappers(<FileTypeIcon fileType="jpg" />)

    expect(getByTestId("image-icon")).toBeDefined()
  })

  it("renders image icon, if file type is .png", () => {
    const { getByTestId } = renderWithWrappers(<FileTypeIcon fileType="png" />)

    expect(getByTestId("image-icon")).toBeDefined()
  })

  it("renders the doc icon, which is default, if fileType is nothing", () => {
    const { getByTestId } = renderWithWrappers(<FileTypeIcon />)

    expect(getByTestId("default-icon")).toBeDefined()
  })

  it("renders doc icon, if file type is .txt", () => {
    const { getByTestId } = renderWithWrappers(<FileTypeIcon fileType="txt" />)

    expect(getByTestId("default-icon")).toBeDefined()
  })
})
