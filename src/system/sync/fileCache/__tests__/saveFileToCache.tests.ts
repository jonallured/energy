import { writeFile } from "react-native-fs"
import { getFilePath } from "system/sync/fileCache/getFilePath"
import { SaveFileProps, saveFileToCache } from "system/sync/fileCache/saveFileToCache"
import { warmFilesystem } from "system/sync/fileCache/warmFilesystem"

jest.mock("react-native-fs", () => ({
  writeFile: jest.fn(),
}))

jest.mock("../getFilePath", () => ({
  getFilePath: jest.fn(),
}))

jest.mock("../warmFilesystem", () => ({
  warmFilesystem: jest.fn(),
}))

describe("saveFileToCache", () => {
  const getFilePathMock = getFilePath as jest.Mock
  const warmFilesystemMock = warmFilesystem as jest.Mock

  const props: SaveFileProps = {
    data: "test data",
    filename: "test.txt",
    type: "document",
    path: undefined,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should call warmFilesystem before writing the file", async () => {
    getFilePathMock.mockReturnValueOnce("/cache/documents/test.txt")
    await saveFileToCache(props)
    expect(warmFilesystemMock).toHaveBeenCalled()
  })

  it("should call getFilePath with type and filename if type is defined", async () => {
    getFilePathMock.mockReturnValueOnce("/cache/documents/test.txt")
    await saveFileToCache(props)
    expect(getFilePath).toHaveBeenCalledWith({ type: "document", filename: "test.txt" })
  })

  it("should call writeFile with the correct arguments", async () => {
    const writePath = "/cache/documents/test.txt"
    getFilePathMock.mockReturnValueOnce(writePath)
    await saveFileToCache(props)
    expect(writeFile).toHaveBeenCalledWith(writePath, "test data", "utf8")
  })
})
