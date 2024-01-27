import {
  FileProps,
  PATH_CACHE_DOCUMENTS,
  PATH_CACHE_IMAGES,
  PATH_CACHE_JSON,
} from "system/sync/fileCache/constants"
import { getFilePath } from "system/sync/fileCache/getFilePath"

describe("getFilePath", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("returns the correct path for a document file", () => {
    const fileProps: FileProps = {
      filename: "document.pdf",
      type: "document",
    }

    const expectedPath = `${PATH_CACHE_DOCUMENTS}/document.pdf`
    const actualPath = getFilePath(fileProps)

    expect(actualPath).toEqual(expectedPath)
  })

  it("returns the correct path for an image file", () => {
    const fileProps: FileProps = {
      filename: "image.jpg",
      type: "image",
    }

    const expectedPath = `${PATH_CACHE_IMAGES}/image.jpg`
    const actualPath = getFilePath(fileProps)

    expect(actualPath).toEqual(expectedPath)
  })

  it("returns the correct path for a relay json data file", () => {
    const fileProps: FileProps = {
      filename: "relay.json",
      type: "json",
    }

    const expectedPath = `${PATH_CACHE_JSON}/relay.json`
    const actualPath = getFilePath(fileProps)

    expect(actualPath).toEqual(expectedPath)
  })
})
