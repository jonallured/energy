import { exists, unlink } from "react-native-fs"
import { clearFileCache } from "system/sync/fileCache/clearFileCache"
import { PATH_CACHE } from "system/sync/fileCache/constants"
import { clearUrlMap } from "system/sync/fileCache/urlMap"

jest.mock("react-native-fs")
jest.mock("system/sync/fileCache/urlMap")

describe("clearFileCache", () => {
  const existsMock = exists as jest.Mock
  const unlinkMock = unlink as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should delete the file if it exists", async () => {
    existsMock.mockResolvedValue(true)
    await clearFileCache()
    expect(clearUrlMap).toHaveBeenCalledTimes(1)
    expect(exists).toHaveBeenCalledTimes(1)
    expect(exists).toHaveBeenCalledWith(PATH_CACHE)
    expect(unlink).toHaveBeenCalledTimes(1)
    expect(unlink).toHaveBeenCalledWith(PATH_CACHE)
  })

  it("should not delete the file if it does not exist", async () => {
    existsMock.mockResolvedValue(false)
    await clearFileCache()
    expect(clearUrlMap).toHaveBeenCalledTimes(1)
    expect(exists).toHaveBeenCalledTimes(1)
    expect(exists).toHaveBeenCalledWith(PATH_CACHE)
    expect(unlink).not.toHaveBeenCalled()
  })

  it("should throw an error if exists() throws an error", async () => {
    const error = new Error("Filesystem error")
    existsMock.mockRejectedValue(error)
    await expect(clearFileCache()).rejects.toThrow(error)
    expect(clearUrlMap).toHaveBeenCalledTimes(1)
    expect(exists).toHaveBeenCalledTimes(1)
    expect(exists).toHaveBeenCalledWith(PATH_CACHE)
    expect(unlink).not.toHaveBeenCalled()
  })

  it("should throw an error if unlink() throws an error", async () => {
    const error = new Error("Filesystem error")
    existsMock.mockResolvedValue(true)
    unlinkMock.mockRejectedValue(error)
    await expect(clearFileCache()).rejects.toThrow(error)
    expect(clearUrlMap).toHaveBeenCalledTimes(1)
    expect(exists).toHaveBeenCalledTimes(1)
    expect(exists).toHaveBeenCalledWith(PATH_CACHE)
    expect(unlink).toHaveBeenCalledTimes(1)
    expect(unlink).toHaveBeenCalledWith(PATH_CACHE)
  })
})
