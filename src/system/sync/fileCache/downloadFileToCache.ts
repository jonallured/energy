import { parse } from "qs"
import { downloadFile, exists, unlink } from "react-native-fs"
import { getFilePath } from "system/sync/fileCache/getFilePath"
import { getURLMap, updateUrlMap } from "system/sync/fileCache/urlMap"
import { warmFilesystem } from "system/sync/fileCache/warmFilesystem"

type DownloadableType = "image" | "document"

export interface DownloadFileToCacheProps {
  url: string
  type: DownloadableType
  accessToken?: string
}

interface InitDownloadFileToCacheProps {
  onFileDownloadError: (fileProps: DownloadFileToCacheProps) => void
}

export const initDownloadFileToCache = ({ onFileDownloadError }: InitDownloadFileToCacheProps) => {
  const downloadFileToCache = async (fileProps: DownloadFileToCacheProps) => {
    const { url, type, accessToken } = fileProps

    if (!url) {
      return null
    }

    try {
      await warmFilesystem()

      const filename = (() => {
        switch (type) {
          case "image": {
            const src = (parse(url).src as string | undefined) ?? url
            const urlParts = src.split("/")

            // Matches the form `http://foo.cloudfront.com/<imageID>/tall.jpg`
            const imageID = urlParts[urlParts.length - 2]
            const imageExtension = src?.substring(src.lastIndexOf("."))
            return imageID + imageExtension
          }
          case "document":
            return url.split("/").pop()!
        }
      })()

      const urlMap = getURLMap()

      const filePath = getFilePath({ type, filename })

      const alreadyExists = (await exists(filePath)) && urlMap[url]

      // If we've already downloaded the images to the users device, resolve
      // and skip downloading the file again.
      if (alreadyExists) {
        return Promise.resolve()
      }

      const { statusCode } = await downloadFile({
        fromUrl: url,
        toFile: filePath,
        headers: accessToken ? { "X-ACCESS-TOKEN": accessToken } : undefined,
      }).promise

      if (statusCode !== 200) {
        throw new Error("download failed with status code " + statusCode + " - " + url)
      }

      if (urlMap[url] !== undefined && urlMap[url] !== filename) {
        try {
          await unlink(getFilePath({ filename: urlMap[url], type }))
        } catch (error) {
          // If we're updating the url, test whether its been saved. If not, it's
          // not an error, so consume it and don't report back to retry.
        }
      }

      await updateUrlMap(url, filename)
    } catch (error) {
      console.error("[downloadFileToCache] Error:", error)

      // If there's an error, queue up error to retry later
      onFileDownloadError(fileProps)
    }
  }

  return {
    downloadFileToCache,
  }
}
