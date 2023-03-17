import { writeFile } from "react-native-fs"
import { FileProps } from "system/sync/fileCache/constants"
import { getFilePath } from "system/sync/fileCache/getFilePath"
import { warmFilesystem } from "system/sync/fileCache/initializeFS"

interface SaveFileProps extends FileProps {
  data: string
}

export const saveFileToCache = async ({ data, filename, type, path }: SaveFileProps) => {
  try {
    if (!type && !path) {
      console.log("[fileCache] Error saving file: `type` or `path` must be defined.")
      return
    }

    await warmFilesystem()

    let writePath = path as string
    if (type) {
      writePath = getFilePath({ type, filename })
    }

    await writeFile(writePath, data, "utf8")
  } catch (error) {
    console.log("[fileCache] Error saving file:", error)
  }
}
