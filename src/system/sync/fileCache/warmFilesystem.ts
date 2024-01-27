import { exists, mkdir } from "react-native-fs"
import {
  PATH_CACHE_DOCUMENTS,
  PATH_CACHE_IMAGES,
  PATH_CACHE_JSON,
} from "system/sync/fileCache/constants"

export const warmFilesystem = async () => {
  try {
    const cacheReady = await Promise.all([
      await exists(PATH_CACHE_IMAGES),
      await exists(PATH_CACHE_DOCUMENTS),
      await exists(PATH_CACHE_JSON),
    ]).then(([images, documents, relayData]) => images && documents && relayData)

    if (!cacheReady) {
      await createDirectories()
    }
  } catch (error) {
    console.warn("[fileCache] Error preparing cache for write:", error)
  }
}

const createDirectories = async () => {
  try {
    await Promise.all([
      mkdir(PATH_CACHE_IMAGES),
      mkdir(PATH_CACHE_DOCUMENTS),
      mkdir(PATH_CACHE_JSON),
    ])
  } catch (error) {
    console.log("[fileCache] Error creating directories:", error)
  }
}
