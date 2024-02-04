import { useEffect, useState } from "react"
import { exists } from "react-native-fs"
import { AssetType } from "system/sync/fileCache/constants"
import { getFilePath } from "system/sync/fileCache/getFilePath"
import { getURLMap } from "system/sync/fileCache/urlMap"
import { useIsOnline } from "utils/hooks/useIsOnline"

/**
 * This can be used as an offline-first approach to loading images and
 * documents. It will check if the file exists in the cache and return the
 * local path if so; otherwise it will return the online URL.
 */

export const useOfflineCachedURI = (
  url: string,
  type: AssetType = "image"
): string | undefined => {
  const [uri, setUri] = useState<string | undefined>(undefined)
  const urlMap = getURLMap()
  const isOnline = useIsOnline()

  // Grab URL if if exists in the cache map
  const lookupUrl = urlMap[url]

  useEffect(() => {
    const findLocalPath = async () => {
      if (type === "image") {
        const imagePath = getFilePath({
          type: "image",
          filename: lookupUrl,
        })

        if (await exists(imagePath)) {
          setUri("file://" + imagePath)
          return
        }

        // Fallback to online if not cached
        if (isOnline) {
          setUri(url)
          return
        }
      }

      if (type === "document") {
        const documentPath = getFilePath({
          type: "document",
          filename: lookupUrl,
        })

        if (await exists(documentPath)) {
          setUri("file://" + documentPath)
          return
        }
      }
    }

    findLocalPath()
  }, [url, isOnline])

  // While initially looking up the cached file, return the online URL
  if (!uri) {
    if (isOnline) {
      return url
    }
  }

  return uri
}
