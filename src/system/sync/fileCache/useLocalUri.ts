import { useEffect, useState } from "react"
import { exists } from "react-native-fs"
import { AssetType } from "system/sync/fileCache/constants"
import { getFilePath } from "system/sync/fileCache/getFilePath"
import { getURLMap } from "system/sync/fileCache/urlMap"
import { useIsOnline } from "utils/hooks/useIsOnline"

export const useLocalUri = (
  url: string,
  type: AssetType = "image"
): string | undefined => {
  const [uriOrUndef, setUriOrUndef] = useState<string | undefined>(undefined)
  const urlMap = getURLMap()
  const isOnline = useIsOnline()

  // Grab URL if if exists in the cache map
  const mappedURL = urlMap[url]

  useEffect(() => {
    // If we're online, lets return the original URL
    // TODO: In the future we might always want to look in the local cache first
    if (type === "image" && isOnline) {
      setUriOrUndef(url)

      // Offline, look up the image in the cache
    } else {
      const findLocalPath = async () => {
        const pathIfCachedImage = getFilePath({
          type: "image",
          filename: mappedURL,
        })

        if (await exists(pathIfCachedImage)) {
          setUriOrUndef("file://" + pathIfCachedImage)
          return
        }

        const pathIfCachedDocument = getFilePath({
          type: "document",
          filename: mappedURL,
        })

        if (await exists(pathIfCachedDocument)) {
          setUriOrUndef("file://" + pathIfCachedDocument)
          return
        }
      }

      findLocalPath()
    }
  }, [mappedURL, type, isOnline, url])

  return uriOrUndef
}
