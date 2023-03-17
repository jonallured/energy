import { unlink } from "react-native-fs"
import { PATH_CACHE } from "system/sync/fileCache/constants"

export const clearFileCache = async () => {
  await unlink(PATH_CACHE)
}
