import {
  FileProps,
  PATH_CACHE_DOCUMENTS,
  PATH_CACHE_IMAGES,
  PATH_CACHE_RELAY_DATA,
} from "system/sync/fileCache/constants"

export const getFilePath = ({ filename, type }: FileProps) => {
  const path = (() => {
    switch (type) {
      case "document":
        return PATH_CACHE_DOCUMENTS
      case "image":
        return PATH_CACHE_IMAGES
      case "relayData":
        return PATH_CACHE_RELAY_DATA
    }
  })()

  return path + `/${filename}`
}
