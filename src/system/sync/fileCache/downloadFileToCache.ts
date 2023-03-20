import { parse } from "qs"
import { downloadFile, unlink } from "react-native-fs"
import { getFilePath } from "system/sync/fileCache/getFilePath"
import { getURLMap, updateUrlMap } from "system/sync/fileCache/urlMap"
import { warmFilesystem } from "system/sync/fileCache/warmFilesystem"
import { v4 as uuidv4 } from "uuid"

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
        headers: accessToken ? { "X-ACCESS-TOKEN": accessToken } : undefined,
      }).promise

      if (statusCode !== 200) {
        throw new Error("download failed with status code " + statusCode + " - " + url)
      }

      const urlMap = getURLMap()

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
