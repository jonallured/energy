import { JSON_FILES } from "system/sync/fileCache/constants"
import { getCurrentSyncProgress } from "system/sync/fileCache/getCurrentSyncProgress"
import { getFileFromCache } from "system/sync/fileCache/getFileFromCache"

jest.mock("system/sync/fileCache/getFileFromCache")

describe("getCurrentSyncProgress", () => {
  const mockGetFileFromCache = getFileFromCache as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return metadata with currentStep -1 if no sync progress is present", async () => {
    const expectedMetadata = {
      currentStep: -1,
    }
    mockGetFileFromCache.mockResolvedValue(null)

    const result = await getCurrentSyncProgress()

    expect(getFileFromCache).toHaveBeenCalledWith({
      filename: JSON_FILES.syncProgress,
      type: "json",
    })
    expect(result).toEqual(expectedMetadata)
  })

  it("should return parsed sync progress metadata if sync progress exists", async () => {
    const expectedMetadata = {
      currentStep: 3,
    }
    const mockSyncProgress = JSON.stringify(expectedMetadata)
    mockGetFileFromCache.mockResolvedValue(mockSyncProgress)

    const result = await getCurrentSyncProgress()

    expect(getFileFromCache).toHaveBeenCalledWith({
      filename: JSON_FILES.syncProgress,
      type: "json",
    })

    expect(result).toEqual(expectedMetadata)
  })
})
