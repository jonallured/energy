import { exists, readFile } from "react-native-fs"
import { FileProps } from "system/sync/fileCache/constants"
import { getFileFromCache } from "system/sync/fileCache/getFileFromCache"
import { getFilePath } from "system/sync/fileCache/getFilePath"

jest.mock("react-native-fs")
jest.mock("system/sync/fileCache/getFilePath")

describe("getFileFromCache", () => {
  const props: FileProps = { filename: "example.txt", type: "document" }
  const path = "cache/documents/example.txt"

  const existsMock = exists as jest.Mock
  const readFileMock = readFile as jest.Mock
  const getFilePathMock = getFilePath as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return the file if it exists", async () => {
    const fileContents = "This is an example file"
    existsMock.mockResolvedValue(true)
    readFileMock.mockResolvedValue(fileContents)
    getFilePathMock.mockReturnValue(path)
    const file = await getFileFromCache(props)
    expect(getFilePathMock).toHaveBeenCalledTimes(1)
    expect(getFilePathMock).toHaveBeenCalledWith(props)
    expect(existsMock).toHaveBeenCalledTimes(1)
    expect(existsMock).toHaveBeenCalledWith(path)
    expect(readFileMock).toHaveBeenCalledTimes(1)
    expect(readFileMock).toHaveBeenCalledWith(path)
    expect(file).toEqual(fileContents)
  })

  it("should return undefined if the file does not exist", async () => {
    existsMock.mockResolvedValue(false)
    getFilePathMock.mockReturnValue(path)
    const file = await getFileFromCache(props)
    expect(getFilePathMock).toHaveBeenCalledTimes(1)
    expect(getFilePathMock).toHaveBeenCalledWith(props)
    expect(existsMock).toHaveBeenCalledTimes(1)
    expect(existsMock).toHaveBeenCalledWith(path)
    expect(readFileMock).not.toHaveBeenCalled()
    expect(file).toBeUndefined()
  })
})
