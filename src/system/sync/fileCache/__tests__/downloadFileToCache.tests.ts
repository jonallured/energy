import { downloadFile } from "react-native-fs"
import { initDownloadFileToCache } from "system/sync/fileCache/downloadFileToCache"
import { getFilePath } from "system/sync/fileCache/getFilePath"
import { warmFilesystem } from "system/sync/fileCache/warmFilesystem"

jest.mock("react-native-fs")
jest.mock("system/sync/fileCache/warmFilesystem")
jest.mock("system/sync/fileCache/getFilePath")
jest.mock("system/sync/fileCache/urlMap")

describe("initDownloadFileToCache", () => {
  const downloadFileMock = downloadFile as jest.Mock
  const warmFilesystemMock = warmFilesystem as jest.Mock

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("calls warmFilesystem", async () => {
    const { downloadFileToCache } = initDownloadFileToCache({
      onFileDownloadError: jest.fn(),
    })

    await downloadFileToCache({ url: "https://example.com", type: "image" })

    expect(warmFilesystemMock).toHaveBeenCalledTimes(1)
  })

  it("calls downloadFile with the correct arguments", async () => {
    const { downloadFileToCache } = initDownloadFileToCache({
      onFileDownloadError: jest.fn(),
    })

    const url = "https://example.com/image.png"
    const accessToken = "123"

    await downloadFileToCache({ url, type: "image", accessToken })

    expect(downloadFileMock).toHaveBeenCalledTimes(1)
    expect(downloadFileMock).toHaveBeenCalledWith({
      fromUrl: url,
      toFile: getFilePath({ type: "image", filename: expect.any(String) }),
      headers: { "X-ACCESS-TOKEN": accessToken },
    })
  })

  it("calls onFileDownloadError if an error occurs", async () => {
    const onFileDownloadError = jest.fn()
    const { downloadFileToCache } = initDownloadFileToCache({ onFileDownloadError })

    const url = "https://example.com/image.png"

    downloadFileMock.mockRejectedValueOnce(new Error("failed"))

    await downloadFileToCache({ url, type: "image" })

    expect(onFileDownloadError).toHaveBeenCalledTimes(1)
    expect(onFileDownloadError).toHaveBeenCalledWith({ url, type: "image" })
  })
})
