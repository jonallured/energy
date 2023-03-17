import { DocumentDirectoryPath } from "react-native-fs"

export type AssetType = "image" | "document"
type FileType = AssetType | "relayData"

export interface FileProps {
  filename: string
  type?: FileType
  path?: string
}

export const PATH_CACHE = DocumentDirectoryPath + "/cache"
export const PATH_CACHE_IMAGES = PATH_CACHE + "/images"
export const PATH_CACHE_DOCUMENTS = PATH_CACHE + "/documents"
export const PATH_CACHE_RELAY_DATA = PATH_CACHE + "/relayData"
