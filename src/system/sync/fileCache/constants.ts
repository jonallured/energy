import { DocumentDirectoryPath } from "react-native-fs"

export type AssetType = "image" | "document" | "json"

export interface FileProps {
  filename: string
  type?: AssetType
  path?: string
}

export const PATH_CACHE = DocumentDirectoryPath + "/cache"
export const PATH_CACHE_IMAGES = PATH_CACHE + "/images"
export const PATH_CACHE_DOCUMENTS = PATH_CACHE + "/documents"
export const PATH_CACHE_JSON = PATH_CACHE + "/json"

export const JSON_FILES = {
  relayData: "relayData.json",
  syncProgress: "syncProgress.json",
}
