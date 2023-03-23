import { exists, unlink } from "react-native-fs"
import { saveFileToCache } from "system/sync/fileCache/saveFileToCache"
import {
  updateUrlMap,
  loadUrlMap,
  getURLMap,
  saveUrlMap,
  clearUrlMap,
} from "system/sync/fileCache/urlMap"

jest.mock("system/sync/fileCache/saveFileToCache")
jest.mock("react-native-fs", () => ({
  DocumentDirectoryPath: "testPath",
  exists: jest.fn(),
  unlink: jest.fn(),
}))

describe("urlMap", () => {
  const saveFileToCacheMock = saveFileToCache as jest.Mock
  const existsMock = exists as jest.Mock

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should be able to update the urlMap with a key-value pair", async () => {
    const key = "testKey"
    const value = "testValue"

    await updateUrlMap(key, value)
    await loadUrlMap()
    const urlMap = getURLMap()

    expect(urlMap[key]).toEqual(value)
  })

  it("should be able to update the urlMap with multiple key-value pairs", async () => {
    const key1 = "testKey1"
    const value1 = "testValue1"
    const key2 = "testKey2"
    const value2 = "testValue2"

    await updateUrlMap(key1, value1)
    await updateUrlMap(key2, value2)
    await loadUrlMap()
    const urlMap = getURLMap()

    expect(urlMap[key1]).toEqual(value1)
    expect(urlMap[key2]).toEqual(value2)
  })

  it("should be able to load the urlMap from disk", async () => {
    const key = "testKey"
    const value = "testValue"

    await updateUrlMap(key, value)
    await loadUrlMap()

    const urlMap = getURLMap()
    expect(urlMap[key]).toEqual(value)
  })

  it("calls saveFileToCache with the correct arguments", async () => {
    await saveUrlMap()

    expect(saveFileToCacheMock).toHaveBeenCalledWith({
      data: '{"testKey":"testValue","testKey1":"testValue1","testKey2":"testValue2"}',
      filename: "urlMap",
      path: "testPath/cache/urlMap.json",
    })
  })

  it("clears out the urlMap", async () => {
    existsMock.mockReturnValueOnce(true)
    await clearUrlMap()

    expect(exists).toHaveBeenCalledTimes(1)
    expect(unlink).toHaveBeenCalledTimes(1)

    await loadUrlMap()
    const urlMap = getURLMap()
    expect(urlMap).toEqual({})
  })
})
