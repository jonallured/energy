import {
  FileProps,
  PATH_CACHE_DOCUMENTS,
  PATH_CACHE_IMAGES,
  PATH_CACHE_JSON,
} from "system/sync/fileCache/constants"

export const getFilePath = ({ filename, type }: FileProps) => {
  const path = (() => {
    switch (type) {
      case "document":
        return PATH_CACHE_DOCUMENTS
      case "image":
        return PATH_CACHE_IMAGES
      case "json":
        return PATH_CACHE_JSON
    }
  })()

  return path + `/${filename}`
}
