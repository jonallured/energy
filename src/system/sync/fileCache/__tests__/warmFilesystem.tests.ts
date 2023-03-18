import { exists, mkdir } from "react-native-fs"
import {
  PATH_CACHE_DOCUMENTS,
  PATH_CACHE_IMAGES,
  PATH_CACHE_RELAY_DATA,
} from "system/sync/fileCache/constants"
import { warmFilesystem } from "system/sync/fileCache/warmFilesystem"

jest.mock("react-native-fs", () => ({
  exists: jest.fn(),
  mkdir: jest.fn(),
}))

describe("warmFilesystem", () => {
  const existsMock = exists as jest.Mock
  const mkdirMock = mkdir as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("does nothing if the cache directories already exist", async () => {
    existsMock.mockResolvedValue(true)

    await warmFilesystem()

    expect(existsMock).toHaveBeenCalledTimes(3)
    expect(mkdirMock).not.toHaveBeenCalled()
  })

  it("creates the cache directories if they don't exist", async () => {
    existsMock.mockResolvedValue(false)

    await warmFilesystem()

    expect(existsMock).toHaveBeenCalledTimes(3)
    expect(mkdirMock).toHaveBeenCalledTimes(3)
    expect(mkdirMock).toHaveBeenCalledWith(PATH_CACHE_IMAGES)
    expect(mkdirMock).toHaveBeenCalledWith(PATH_CACHE_DOCUMENTS)
    expect(mkdirMock).toHaveBeenCalledWith(PATH_CACHE_RELAY_DATA)
  })

  it("logs an error message if there is an error creating the directories", async () => {
    existsMock.mockResolvedValue(false)
    mkdirMock.mockRejectedValue(new Error("Failed to create directory"))

    await warmFilesystem()

    expect(existsMock).toHaveBeenCalledTimes(3)
    expect(mkdirMock).toHaveBeenCalledTimes(3)
    expect(mkdirMock).toHaveBeenCalledWith(PATH_CACHE_IMAGES)
    expect(mkdirMock).toHaveBeenCalledWith(PATH_CACHE_DOCUMENTS)
    expect(mkdirMock).toHaveBeenCalledWith(PATH_CACHE_RELAY_DATA)
  })

  it("logs an error message if there is an error checking directory existence", async () => {
    existsMock.mockRejectedValue(new Error("Failed to check directory existence"))

    await warmFilesystem()

    expect(existsMock).toHaveBeenCalledTimes(1)
    expect(mkdirMock).not.toHaveBeenCalled()
  })
})
