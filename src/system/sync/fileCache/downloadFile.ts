import { parse } from "qs"
import { downloadFile, unlink } from "react-native-fs"
import { getFilePath } from "system/sync/fileCache/getFilePath"
import { warmFilesystem } from "system/sync/fileCache/initializeFS"
import { getURLMap, updateUrlMap } from "system/sync/fileCache/urlMap"
import { v4 as uuidv4 } from "uuid"

type DownloadableType = "image" | "document"

interface DownloadFileToCacheProps {
  url: string
  type: DownloadableType
  accessToken?: string
}

export const downloadFileToCache = async ({ url, type, accessToken }: DownloadFileToCacheProps) => {
  if (!url) {
    return null
  }

  const MAX_ERROR_RETRY_ATTEMPTS = 3

  let errorRetryAttempt = 0

  const startDownload = async () => {
    try {
      await warmFilesystem()

      const id = uuidv4()

      const filename = (() => {
        switch (type) {
          case "image": {
            const src = (parse(url).src as string | undefined) ?? url
            const imageExtension = src?.substring(src.lastIndexOf("."))
            return id + imageExtension
          }
          case "document":
            return url.split("/").pop()!
        }
      })()

      const filePath = getFilePath({ type, filename })

      const { statusCode } = await downloadFile({
        fromUrl: url,
        toFile: filePath,
        headers: accessToken !== undefined ? { "X-ACCESS-TOKEN": accessToken } : undefined,
      }).promise

      if (statusCode !== 200) {
        throw new Error("download failed with status code " + statusCode + " - " + url)
      }

      const urlMap = getURLMap()

      if (urlMap[url] !== undefined && urlMap[url] !== filename) {
        try {
          await unlink(getFilePath({ filename: urlMap[url], type }))
        } catch (error) {
          console.log("[fileCache] Error unlinking file:", error, urlMap[url], filename)
        }
      }

      await updateUrlMap(url, filename)

      // If there's an error, start the retry loop
    } catch (error) {
      if (errorRetryAttempt <= MAX_ERROR_RETRY_ATTEMPTS) {
        errorRetryAttempt++

        console.log(
          `[fileCache] Error downloading file: ${error}. Retrying [${errorRetryAttempt}]: ${url}`
        )

        // Retry download
        await startDownload()
      }
    }
  }

  await startDownload()
}
