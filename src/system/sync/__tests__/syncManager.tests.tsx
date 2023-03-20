import { ArtistArtworksQuery$data } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtistDocumentsQuery$data } from "__generated__/ArtistDocumentsQuery.graphql"
import { ArtistShowsQuery$rawResponse } from "__generated__/ArtistShowsQuery.graphql"
import { ArtistsListQuery$data } from "__generated__/ArtistsListQuery.graphql"
import { ArtworkQuery$data } from "__generated__/ArtworkQuery.graphql"
import { ShowsQuery$data } from "__generated__/ShowsQuery.graphql"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { getFileFromCache, initDownloadFileToCache, saveFileToCache } from "system/sync/fileCache"
import { initSyncManager, loadRelayDataFromOfflineCache, _tests } from "system/sync/syncManager"
import { initFetchOrCatch } from "system/sync/utils/fetchOrCatch"
import { flushPromiseQueue } from "utils/test/flushPromiseQueue"

jest.mock("system/sync/utils/fetchOrCatch")
jest.mock("system/sync/fileCache")
jest.mock("system/sync/fileCache/downloadFileToCache")

describe("syncManager", () => {
  console.log = jest.fn()

  const initFetchOrCatchMock = initFetchOrCatch as jest.Mock
  const initDownloadFileToCacheMock = initDownloadFileToCache as jest.Mock
  const saveFileToCacheMock = saveFileToCache as jest.Mock
  const getFileFromCacheMock = getFileFromCache as jest.Mock

  beforeEach(() => {
    initFetchOrCatchMock.mockReturnValue({
      fetchOrCatch: jest.fn(),
    })
    initDownloadFileToCacheMock.mockReturnValue({
      downloadFileToCache: jest.fn(),
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("public api", () => {
    const setup = (
      partnerID: string | null = "partner-id",
      mockRelayEnv: RelayModernEnvironment | null = null
    ) => {
      const onStartSpy = jest.fn()
      const onProgressSpy = jest.fn()
      const onStatusChangeSpy = jest.fn()
      const onCompleteSpy = jest.fn()
      const onSyncResultsChangeSpy = jest.fn()

      const relayEnvironmentSpy = mockRelayEnv ?? (jest.fn() as unknown as RelayModernEnvironment)

      const { startSync } = initSyncManager({
        onStart: onStartSpy,
        onProgress: onProgressSpy,
        onStatusChange: onStatusChangeSpy,
        onComplete: onCompleteSpy,
        onSyncResultsChange: onSyncResultsChangeSpy,
        partnerID: partnerID as string,
        relayEnvironment: relayEnvironmentSpy,
      })

      return {
        onStartSpy,
        onProgressSpy,
        onStatusChangeSpy,
        onCompleteSpy,
        relayEnvironmentSpy,
        startSync,
      }
    }

    it("errors out if no `partnerID` is provided", () => {
      expect(() => {
        setup(null)
      }).toThrowError("[sync] Error initializing sync: `partnerID` is required")
    })

    it("calls onStart", async () => {
      const toJSONSpy = jest.fn().mockReturnValue({ data: "mock-json" })
      const relayEnvironmentMock = {
        getStore: () => ({
          getSource: () => ({
            toJSON: toJSONSpy,
          }),
        }),
      } as unknown as RelayModernEnvironment
      const { startSync, onStartSpy } = setup("partner-id", relayEnvironmentMock)

      await startSync()
      expect(onStartSpy).toBeCalled()
    })

    it("calls onProgress", async () => {
      const toJSONSpy = jest.fn().mockReturnValue({ data: "mock-json" })
      const relayEnvironmentMock = {
        getStore: () => ({
          getSource: () => ({
            toJSON: toJSONSpy,
          }),
        }),
      } as unknown as RelayModernEnvironment
      const { startSync, onProgressSpy } = setup("partner-id", relayEnvironmentMock)
      await startSync()
      expect(onProgressSpy).toBeCalledWith(
        expect.toBeOneOf([expect.toBeString(), expect.toBeNumber()])
      )
    })

    it("calls onStatusChange", async () => {
      const toJSONSpy = jest.fn().mockReturnValue({ data: "mock-json" })
      const relayEnvironmentMock = {
        getStore: () => ({
          getSource: () => ({
            toJSON: toJSONSpy,
          }),
        }),
      } as unknown as RelayModernEnvironment
      const { startSync, onStatusChangeSpy } = setup("partner-id", relayEnvironmentMock)
      await startSync()
      expect(onStatusChangeSpy).toBeCalledWith(expect.toBeString())
    })

    it("calls onComplete", async () => {
      const toJSONSpy = jest.fn().mockReturnValue({ data: "mock-json" })
      const relayEnvironmentMock = {
        getStore: () => ({
          getSource: () => ({
            toJSON: toJSONSpy,
          }),
        }),
      } as unknown as RelayModernEnvironment
      const { startSync, onCompleteSpy } = setup("partner-id", relayEnvironmentMock)
      await startSync()
      expect(onCompleteSpy).toBeCalled()
    })
  })

  describe("parsers", () => {
    const { syncResults, parsers } = _tests

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
      ] as unknown as ArtistArtworksQuery$data[]

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
      syncResults.showsQuery = {
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
      } as unknown as ShowsQuery$data

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

      _tests.saveRelayDataToOfflineCache(relayEnvironmentMock as unknown as RelayModernEnvironment)

      expect(toJSONSpy).toBeCalled()
      expect(saveFileToCacheSpy).toHaveBeenCalledWith({
        data: '{"data":"mock-json"}',
        filename: "relayData.json",
        type: "relayData",
      })
    })

    it("retrieves file from cache", async () => {
      const resetRelayEnvironmentSpy = jest.fn()
      const getFileFromCacheSpy = jest.fn().mockResolvedValue('{"data":"mock-json"}')
      getFileFromCacheMock.mockImplementation(getFileFromCacheSpy)
      loadRelayDataFromOfflineCache(resetRelayEnvironmentSpy)

      await flushPromiseQueue()

      expect(resetRelayEnvironmentSpy).toHaveBeenCalledWith({ data: "mock-json" })
    })
  })
})
