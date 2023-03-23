import { produce } from "immer"
import { exists, readFile, unlink } from "react-native-fs"
import { saveFileToCache } from "system/sync/fileCache"
import { PATH_CACHE } from "system/sync/fileCache/constants"

let urlMap: Record<string, string> = {}

export const getURLMap = () => urlMap

export const updateUrlMap = async (key: string, value: string) => {
  urlMap = produce(urlMap, (draft) => {
    draft[key] = value
  })

  await saveUrlMap()
}

export const saveUrlMap = async () => {
  try {
    await saveFileToCache({
      data: JSON.stringify(urlMap),
      filename: "urlMap",
      path: PATH_CACHE + "/urlMap.json",
    })
  } catch (error) {
    console.log("[fileCache] Error saving urlMap:", error)
  }
}

export const clearUrlMap = async () => {
  try {
    urlMap = {}
    const path = PATH_CACHE + "/urlMap.json"
    if (!(await exists(path))) {
      return
    }
    await unlink(path)
  } catch (error) {
    console.log("[fileCache] Error deleting urlMap:", error)
  }
}

export const loadUrlMap = async () => {
  try {
    const path = PATH_CACHE + "/urlMap.json"
    if (!(await exists(path))) {
      return
    }

    urlMap = JSON.parse(await readFile(path))
  } catch (error) {
    console.log("[fileCache] Error loading urlMap:", error)
  }
}
