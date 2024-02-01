import { exists, unlink } from "react-native-fs"
import { clearUrlMap } from "system/sync/fileCache"
import {
  JSON_FILES,
  PATH_CACHE,
  PATH_CACHE_JSON,
} from "system/sync/fileCache/constants"

export const clearFileCache = async () => {
  clearUrlMap()

  const fileExists = await exists(PATH_CACHE)

  if (fileExists) {
    await unlink(PATH_CACHE)
  }
}

export const clearSyncProgressFileCache = async () => {
  const filePath = `${PATH_CACHE_JSON}/${JSON_FILES.syncProgress}`

  const fileExists = await exists(filePath)

  if (fileExists) {
    await unlink(filePath)
  }
}
