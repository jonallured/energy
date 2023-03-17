import { exists, readFile } from "react-native-fs"
import { FileProps } from "system/sync/fileCache/constants"
import { getFilePath } from "system/sync/fileCache/getFilePath"

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
