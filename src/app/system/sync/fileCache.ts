import { atom, useAtom } from "jotai"
import { readAtom, writeAtom } from "jotai-nexus"
import { parse } from "qs"
import { useEffect, useState } from "react"
import {
  unlink,
  mkdir,
  exists,
  writeFile,
  DocumentDirectoryPath,
  readFile,
  downloadFile,
} from "react-native-fs"
import { v4 as uuidv4 } from "uuid"
import { useIsOnline } from "app/utils/hooks/useIsOnline"

const PATH_CACHE = DocumentDirectoryPath + "/cache"
const PATH_CACHE_IMAGES = PATH_CACHE + "/images"
const PATH_CACHE_DOCUMENTS = PATH_CACHE + "/documents"
const PATH_CACHE_RELAY_DATA = PATH_CACHE + "/relayData"

const urlMapAtom = atom<Record<string, string>>({})

type DownloadableType = "image" | "document"
type Type = DownloadableType | "relayData"

interface FileProps {
  filename: string

  type?: Type
  path?: string
}

interface SaveFileProps extends FileProps {
  data: string
}

export const saveFileToCache = async ({ data, filename, type, path }: SaveFileProps) => {
  try {
    if (type === undefined && path === undefined) {
      console.log("[fileCache] Error saving file: `type` or `path` must be defined.")
      return
    }

    await makeSureCacheIsReady()

    const actualPath = type !== undefined ? getFilePath({ type, filename }) : path!

    await writeFile(actualPath, data, "utf8")
  } catch (error) {
    console.log("[fileCache] Error saving file:", error)
  }
}

export const downloadFileToCache = async ({
  url,
  type,
  accessToken,
}: {
  url: string
  type: DownloadableType
  accessToken?: string
}) => {
  if (!url) {
    return null
  }

  const MAX_ERROR_RETRY_ATTEMPTS = 3

  let errorRetryAttempt = 0

  const startDownload = async () => {
    try {
      await makeSureCacheIsReady()

      const id = uuidv4()

      const filename = (() => {
        switch (type) {
          case "image": {
            const src = parse(url).src as string
            const imageExtension = src?.substring(src.lastIndexOf("."))
            return id + imageExtension
          }
          case "document":
            return url.split("/").pop()!
          default:
            assertNever(type)
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

      const urlMap = readAtom(urlMapAtom)
      if (urlMap[url] !== undefined && urlMap[url] !== filename) {
        try {
          await unlink(getFilePath({ filename: urlMap[url], type }))
          // eslint-disable-next-line no-empty
        } catch (_) {}
      }

      urlMap[url] = filename
      writeAtom(urlMapAtom, urlMap)

      await saveUrlMap()
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

export const getFileFromCache = async ({ filename, type }: FileProps) => {
  try {
    const path = getFilePath({ type, filename })

    const fileExists = await exists(path)

    if (!fileExists) {
      console.warn("[fileCache] File path doesn't exist in cache:", path)
      return
    }

    const file = readFile(path)
    return file
  } catch (error) {
    console.warn("[fileCache] Error retrieving file from cache:", error)
  }
}

const makeSureCacheIsReady = async () => {
  try {
    // console.log({ PATH_CACHE })
    const cacheReady = await Promise.all([
      await exists(PATH_CACHE_IMAGES),
      await exists(PATH_CACHE_DOCUMENTS),
      await exists(PATH_CACHE_RELAY_DATA),
    ]).then(([images, documents, relayData]) => images && documents && relayData)

    if (!cacheReady) {
      await prepareCache()
    }
  } catch (error) {
    console.warn("[fileCache] Error warming up cache:", error)
  }
}

const prepareCache = async () => {
  try {
    await mkdir(PATH_CACHE_IMAGES)
    await mkdir(PATH_CACHE_DOCUMENTS)
    await mkdir(PATH_CACHE_RELAY_DATA)
  } catch (error) {
    console.log("[fileCache] Error preparing cache:", error)
  }
}

export const clearFileCache = async () => {
  await unlink(PATH_CACHE)
}

const getFilePath = ({ filename, type }: FileProps) => {
  const path = (() => {
    switch (type) {
      case "document":
        return PATH_CACHE_DOCUMENTS
      case "image":
        return PATH_CACHE_IMAGES
      case "relayData":
        return PATH_CACHE_RELAY_DATA
    }
  })()

  return path + `/${filename}`
}

export const useLocalUri = (url: string, type: DownloadableType = "image"): string | undefined => {
  const [uriOrUndef, setUriOrUndef] = useState<string | undefined>(undefined)
  const [urlMap] = useAtom(urlMapAtom)
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

export const loadUrlMap = async () => {
  try {
    const path = PATH_CACHE + "/urlMap.json"
    if (!(await exists(path))) {
      return
    }

    writeAtom(urlMapAtom, JSON.parse(await readFile(path)))
  } catch (error) {
    console.log("[fileCache] Error loading urlMap:", error)
  }
}

const saveUrlMap = async () => {
  try {
    await saveFileToCache({
      data: JSON.stringify(readAtom(urlMapAtom)),
      filename: "urlMap",
      path: PATH_CACHE + "/urlMap.json",
    })
  } catch (error) {
    console.log("[fileCache] Error saving urlMap:", error)
  }
}
