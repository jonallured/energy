import { atom, useAtom } from "jotai"
import { readAtom, writeAtom } from "jotai-nexus"
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

const PATH_CACHE = DocumentDirectoryPath + "/cache"
const PATH_CACHE_IMAGES = PATH_CACHE + "/images"
const PATH_CACHE_DOCUMENTS = PATH_CACHE + "/documents"
const PATH_CACHE_RELAY_DATA = PATH_CACHE + "/relayData"

const urlMapAtom = atom<Record<string, string>>({})

/**
 * This is just for debugging!
 * The app doesnt need an extension here.
 * But if we want to debug and see the images in the simulator's file system in Finder,
 * then adding an extension will make quicklook show them as images.
 * eg. If you go to `~/Library/Developer/CoreSimulator/Devices/uuid-of-simulator/data/Containers/Data/Application/uuid-of-application/Documents/cache/images`
 * you can see the cached images in there.
 */
const DEBUG_IMAGE_CACHE = false // turn this on to debug easier with quicklook
const IMAGE_EXTENSION = __DEV__ && DEBUG_IMAGE_CACHE ? ".png" : ""

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
  try {
    await makeSureCacheIsReady()

    const id = uuidv4()

    const filename = (() => {
      switch (type) {
        case "image":
          return id + IMAGE_EXTENSION
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
      throw new Error("download failed with status code " + statusCode)
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
    console.log("[fileCache] Error downloading file:", error)
  }
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

export const useLocalUri = (url: string): string | undefined => {
  const [localOrUndef, setLocalOrUndef] = useState<string | undefined>(undefined)
  const [urlMap] = useAtom(urlMapAtom)

  const mappedURL = urlMap[url]
  useEffect(() => {
    const findLocalPath = async () => {
      const pathIfCachedImage = getFilePath({
        type: "image",
        filename: mappedURL + IMAGE_EXTENSION,
      })

      if (await exists(pathIfCachedImage)) {
        setLocalOrUndef("file://" + pathIfCachedImage)
        return
      }

      const pathIfCachedDocument = getFilePath({
        type: "document",
        filename: mappedURL,
      })

      if (await exists(pathIfCachedDocument)) {
        setLocalOrUndef("file://" + pathIfCachedDocument)
        return
      }
    }

    findLocalPath()
  }, [mappedURL])

  return localOrUndef
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
