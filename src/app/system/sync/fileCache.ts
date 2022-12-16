import { nanoid } from "nanoid/non-secure"
import {
  unlink,
  mkdir,
  exists,
  writeFile,
  DocumentDirectoryPath,
  readFile,
  downloadFile,
} from "react-native-fs"

const PATH_CACHE = DocumentDirectoryPath + "/cache"
const PATH_CACHE_IMAGES = PATH_CACHE + "/images"
const PATH_CACHE_DOCUMENTS = PATH_CACHE + "/documents"
const PATH_CACHE_JSON = PATH_CACHE + "/json"

interface FileProps {
  filename: string
  type: "document" | "json" | "image"
}

interface SaveFileProps extends FileProps {
  data: string
}

export const saveFileToCache = async ({ data, filename, type }: SaveFileProps) => {
  await makeSureCacheIsReady()

  const path = getFilePath({ type, filename })

  try {
    await writeFile(path, data, "utf8")
  } catch (error) {
    console.log("[fileCache] Error saving file:", error)
  }
}

export const downloadImageToCache = async (url: string) => {
  await makeSureCacheIsReady()

  const id = nanoid()

  downloadFile({
    fromUrl: url,
    toFile: getFilePath({ type: "image", filename: id + ".png" }),
  })

  // TODO: delete old file if it exists
  urlMap[url] = id
}

export const getFileFromCache = async ({ filename, type }: FileProps) => {
  const path = getFilePath({ type, filename })

  try {
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
    const cacheReady = await Promise.all([
      await exists(PATH_CACHE_IMAGES),
      await exists(PATH_CACHE_DOCUMENTS),
      await exists(PATH_CACHE_JSON),
    ]).then(([images, documents, json]) => images && documents && json)

    if (!cacheReady) {
      await prepareCache()
    }
  } catch (error) {
    console.warn("[fileCache] Error warming up cache:", error)
  }
}

const prepareCache = async () => {
  await mkdir(PATH_CACHE_IMAGES)
  await mkdir(PATH_CACHE_DOCUMENTS)
  await mkdir(PATH_CACHE_JSON)
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
      case "json":
        return PATH_CACHE_JSON
    }
  })()

  return path + `/${filename}`
}

const urlMap: Record<string, string> = {} // export as json
