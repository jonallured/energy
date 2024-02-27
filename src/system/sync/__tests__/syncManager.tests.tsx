import { ArtistArtworksOfflineQuery$data } from "__generated__/ArtistArtworksOfflineQuery.graphql"
import { ArtistDocumentsQuery$data } from "__generated__/ArtistDocumentsQuery.graphql"
import { ArtistShowsQuery$rawResponse } from "__generated__/ArtistShowsQuery.graphql"
import { ArtistsListQuery$data } from "__generated__/ArtistsListQuery.graphql"
import { ArtworkQuery$data } from "__generated__/ArtworkQuery.graphql"
import { ShowsTabQuery$data } from "__generated__/ShowsTabQuery.graphql"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import {
  JSON_FILES,
  getFileFromCache,
  initDownloadFileToCache,
  saveFileToCache,
} from "system/sync/fileCache"
import {
  initSyncManager,
  loadRelayDataFromOfflineCache,
  saveRelayDataToOfflineCache,
  tests,
} from "system/sync/syncManager"
import { initFetchOrCatch } from "system/sync/utils/fetchOrCatch"
import { delay } from "utils/delay"
import { flushPromiseQueue } from "utils/test/flushPromiseQueue"

jest.mock("system/sync/utils/fetchOrCatch")
jest.mock("system/sync/fileCache")
jest.mock("system/sync/fileCache/downloadFileToCache")
jest.mock("utils/delay")

describe("syncManager", () => {
  const mockDelay = delay as jest.Mock
  const initFetchOrCatchMock = initFetchOrCatch as jest.Mock
  const initDownloadFileToCacheMock = initDownloadFileToCache as jest.Mock
  const saveFileToCacheMock = saveFileToCache as jest.Mock
  const getFileFromCacheMock = getFileFromCache as jest.Mock

  beforeEach(() => {
    // Note! Uncomment this if you want to debug. Otherwise it silences a lot
    // of logging
    console.log = jest.fn()

    mockDelay.mockImplementation(() => Promise.resolve())
    initFetchOrCatchMock.mockReturnValue({
      fetchOrCatch: jest.fn(),
    })
    initDownloadFileToCacheMock.mockReturnValue({
      downloadFileToCache: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("public api", () => {
    const setup = (
      partnerID: string | null = "partner-id",
      mockRelayEnv: RelayModernEnvironment | null = null
    ) => {
      const toJSONSpy = jest.fn().mockReturnValue({ data: "mock-json" })
      const relayEnvironmentMock = {
        getStore: () => ({
          getSource: () => ({
            toJSON: toJSONSpy,
          }),
        }),
      } as unknown as RelayModernEnvironment

      const onAbortSpy = jest.fn()
      const onCompleteSpy = jest.fn()
      const onProgressChangeSpy = jest.fn()
      const onStartSpy = jest.fn()
      const onStatusChangeSpy = jest.fn()
      const onStepChangeSpy = jest.fn()
      const onSyncResultsChangeSpy = jest.fn()

      const relayEnvironmentSpy = mockRelayEnv ?? relayEnvironmentMock

      let abortSync: (() => void) | undefined

      const { startSync } = initSyncManager({
        onAbort: (handleAbortSync) => {
          abortSync = () => {
            handleAbortSync()
            onAbortSpy()
          }
        },
        onComplete: onCompleteSpy,
        onProgressChange: onProgressChangeSpy,
        onStart: onStartSpy,
        onStatusChange: onStatusChangeSpy,
        onStepChange: onStepChangeSpy,
        onSyncResultsChange: onSyncResultsChangeSpy,
        partnerID: partnerID as string,
        relayEnvironment: relayEnvironmentSpy,
      })

      return {
        getAbortSync: () => abortSync,
        onAbortSpy,
        onCompleteSpy,
        onProgressChangeSpy,
        onStartSpy,
        onStatusChangeSpy,
        onStepChangeSpy,
        onSyncResultsChangeSpy,
        relayEnvironmentSpy,
        startSync,
      }
    }

    it("errors out if no `partnerID` is provided", () => {
      expect(() => {
        setup(null)
      }).toThrowError("[sync] Error initializing sync: `partnerID` is required")
    })

    it("calls onAbort", async () => {
      const { getAbortSync, onAbortSpy } = setup("partner-id")
      const abortSync = getAbortSync()
      await abortSync?.()
      expect(onAbortSpy).toBeCalled()
    })

    it("calls onComplete", async () => {
      const { startSync, onCompleteSpy } = setup("partner-id")

      await startSync()

      expect(onCompleteSpy).toBeCalled()
    })

    it("calls onProgressChange", async () => {
      const { startSync, onProgressChangeSpy } = setup("partner-id")

      await startSync()

      expect(onProgressChangeSpy).toBeCalledWith(expect.toBeNumber())
    })

    it("calls onStart", async () => {
      const { startSync, onStartSpy } = setup("partner-id")

      await startSync()
      expect(onStartSpy).toBeCalled()
    })

    it("calls onStatusChange", async () => {
      const { startSync, onStatusChangeSpy } = setup("partner-id")

      await startSync()

      expect(onStatusChangeSpy).toBeCalledWith(expect.toBeString())
    })

    it("calls onStepChange", async () => {
      const { startSync, onStepChangeSpy } = setup("partner-id")

      await startSync()

      expect(onStepChangeSpy).toBeCalledWith({
        current: expect.toBeNumber(),
        total: expect.toBeNumber(),
      })
    })

    it("calls onSyncResultsChange", async () => {
      const { startSync, onSyncResultsChangeSpy } = setup("partner-id")

      await startSync()

      expect(onSyncResultsChangeSpy).toBeCalledWith(expect.toBeObject())
    })
  })

  describe("parsers", () => {
    const { syncResults, parsers } = tests

    it("#getArtistSlugs", () => {
      syncResults.artistsListQuery = {
        partner: {
          allArtistsConnection: {
            edges: [
              {
                node: {
                  slug: "artist-1",
                },
              },
            ],
          },
        },
      } as unknown as ArtistsListQuery$data

      expect(parsers.getArtistSlugs()).toEqual(["artist-1"])
    })

    it("#getArtistArtworkSlugs", () => {
      syncResults.artistArtworksQuery = [
        {
          partner: {
            artworksConnection: {
              edges: [
                {
                  node: {
                    slug: "artist-artwork-1",
                  },
                },
              ],
            },
          },
        },
      ] as unknown as ArtistArtworksOfflineQuery$data[]

      expect(parsers.getArtistArtworkSlugs()).toEqual(["artist-artwork-1"])
    })

    it("#getArtistShowSlugs", () => {
      syncResults.artistShowsQuery = [
        {
          partner: {
            showsConnection: {
              edges: [
                {
                  node: {
                    slug: "show-1",
                  },
                },
              ],
            },
          },
        },
      ] as unknown as ArtistShowsQuery$rawResponse[]

      expect(parsers.getArtistShowSlugs()).toEqual(["show-1"])
    })

    it("#getShowSlugs", () => {
      syncResults.showsTabQuery = {
        partner: {
          showsConnection: {
            edges: [
              {
                node: {
                  slug: "show-1",
                },
              },
            ],
          },
        },
      } as unknown as ShowsTabQuery$data

      expect(parsers.getShowSlugs()).toEqual(["show-1"])
    })

    it("#getImageUrls", () => {
      syncResults.artworkQuery = [
        {
          artwork: {
            image: {
              resized: {
                url: "image-url-1",
              },
            },
          },
        },
      ] as unknown as ArtworkQuery$data[]

      expect(parsers.getImageUrls()).toEqual(["image-url-1"])
    })

    it("#getInstallShotUrls", () => {
      syncResults.artistShowsQuery = [
        {
          partner: {
            showsConnection: {
              edges: [
                {
                  node: {
                    coverImage: {
                      url: "image-url-1",
                    },
                  },
                },
              ],
            },
          },
        },
      ] as unknown as ArtistShowsQuery$rawResponse[]

      expect(parsers.getInstallShotUrls()).toEqual(["image-url-1"])
    })

    it("#getDocumentsUrls", () => {
      syncResults.artistDocumentsQuery = [
        {
          partner: {
            documentsConnection: {
              edges: [
                {
                  node: {
                    publicURL: "document-url-1",
                  },
                },
              ],
            },
          },
        },
      ] as unknown as ArtistDocumentsQuery$data[]

      expect(parsers.getDocumentsUrls()).toEqual(["document-url-1"])
    })
  })

  describe("saving and retrieving from cache", () => {
    it("saves file to cache", () => {
      const toJSONSpy = jest.fn().mockReturnValue({ data: "mock-json" })
      const saveFileToCacheSpy = jest.fn()

      const relayEnvironmentMock = {
        getStore: () => ({
          getSource: () => ({
            toJSON: toJSONSpy,
          }),
        }),
      }

      saveFileToCacheMock.mockImplementation(saveFileToCacheSpy)

      tests.saveRelayDataToOfflineCache({
        relayEnvironment:
          relayEnvironmentMock as unknown as RelayModernEnvironment,
      })

      expect(toJSONSpy).toBeCalled()
      expect(saveFileToCacheSpy).toHaveBeenCalledWith({
        data: '{"data":"mock-json"}',
        filename: JSON_FILES.relayData,
        type: "json",
      })
    })

    it("retrieves file from cache", async () => {
      const resetRelayEnvironmentSpy = jest.fn()
      const getFileFromCacheSpy = jest
        .fn()
        .mockResolvedValue('{"data":"mock-json"}')
      getFileFromCacheMock.mockImplementation(getFileFromCacheSpy)
      loadRelayDataFromOfflineCache(resetRelayEnvironmentSpy)

      await flushPromiseQueue()

      expect(resetRelayEnvironmentSpy).toHaveBeenCalledWith({
        data: "mock-json",
      })
    })
  })

  describe("#saveRelayDataToOfflineCache", () => {
    it("should not persist data if sync is aborted", async () => {
      const relayEnvironment = {
        getStore: jest.fn(),
      } as unknown as RelayModernEnvironment

      await saveRelayDataToOfflineCache({
        relayEnvironment,
        persistStepForResume: 1,
        syncAborted: true,
      })

      expect(relayEnvironment.getStore).not.toHaveBeenCalled()
      expect(saveFileToCacheMock).not.toHaveBeenCalled()
    })

    it("should persist relay data to offline cache", async () => {
      const relayEnvironment = {
        getStore: jest.fn(() => ({
          getSource: jest.fn(() => ({
            toJSON: jest.fn(() => ({
              relayData: "mockData",
            })),
          })),
        })),
      } as unknown as RelayModernEnvironment

      await saveRelayDataToOfflineCache({
        relayEnvironment,
        persistStepForResume: 1,
        syncAborted: false,
      })

      expect(relayEnvironment.getStore).toHaveBeenCalled()
      expect(saveFileToCacheMock).toHaveBeenCalledWith({
        data: '{"relayData":"mockData"}',
        filename: "relayData.json",
        type: "json",
      })
    })

    it("should store metadata about current sync progress if persistStepForResume is provided", async () => {
      const relayEnvironment = {
        getStore: jest.fn(() => ({
          getSource: jest.fn(() => ({
            toJSON: jest.fn(() => ({
              relayData: "mockData",
            })),
          })),
        })),
      } as unknown as RelayModernEnvironment

      await saveRelayDataToOfflineCache({
        relayEnvironment,
        persistStepForResume: 5,
        syncAborted: false,
      })

      expect(saveFileToCacheMock).toHaveBeenCalledWith({
        data: '{ "currentStep": 5 }',
        filename: "syncProgress.json",
        type: "json",
      })
    })

    it("should not store metadata if persistStepForResume is not provided", async () => {
      const relayEnvironment = {
        getStore: jest.fn(() => ({
          getSource: jest.fn(() => ({
            toJSON: jest.fn(() => ({
              relayData: "mockData",
            })),
          })),
        })),
      } as unknown as RelayModernEnvironment

      await saveRelayDataToOfflineCache({
        relayEnvironment,
        syncAborted: false,
      })

      expect(saveFileToCacheMock).not.toHaveBeenCalledWith(
        expect.objectContaining({ filename: "syncProgress.json" })
      )
    })
  })
})
