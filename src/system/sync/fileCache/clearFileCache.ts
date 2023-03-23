import { exists, unlink } from "react-native-fs"
import { clearUrlMap } from "system/sync/fileCache"
import { PATH_CACHE } from "system/sync/fileCache/constants"

export const clearFileCache = async () => {
  clearUrlMap()
  const fileExists = await exists(PATH_CACHE)
  if (fileExists) {
    await unlink(PATH_CACHE)
  }
}
