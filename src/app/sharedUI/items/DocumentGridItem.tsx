import { Button, CheckCircleFillIcon, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { last } from "lodash"
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator } from "react-native"
import FileViewer from "react-native-file-viewer"
import RNFetchBlob, { FetchBlobResponse, StatefulPromise } from "rn-fetch-blob"
import { GlobalStore } from "app/store/GlobalStore"
import { getUrlExtension } from "shared/utils"
import { formatBytes } from "shared/utils/formatBytes"
import { FileTypeIcon } from "./FileTypeIcon"

export interface DocumentEntity {
  id: string
  url: string
  size: number
  title: string
}

interface DocumentGridItemProps {
  document: DocumentEntity
  onPress?: () => void
  selectedToAdd?: boolean
}

export const DocumentGridItem: React.FC<DocumentGridItemProps> = (props) => {
  const { document, selectedToAdd, onPress } = props
  const [isDownloading, setIsDownloading] = useState(false)
  const formattedSize = formatBytes(document.size)
  const downloadTask = useRef<StatefulPromise<FetchBlobResponse> | null>(null)
  const fileExtension = last(document.url.split("."))
  const userAccessToken = GlobalStore.useAppState((state) => state.auth.userAccessToken)!
  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isSelectModeActive)

  const downloadFile = async (fileUrl: string, dest: string) => {
    try {
      setIsDownloading(true)
      const fetchInstance = RNFetchBlob.config({
        path: dest,
      })

      downloadTask.current = fetchInstance.fetch("GET", fileUrl, {
        "X-ACCESS-TOKEN": userAccessToken,
      })
      await downloadTask.current
    } catch (error) {
      // Trying to silently remove the file
      RNFetchBlob.fs.unlink(dest).catch(() => {})

      throw error
    } finally {
      downloadTask.current = null
      setIsDownloading(false)
    }
  }

  const openFile = async () => {
    try {
      const fileExt = getUrlExtension(document.url)
      const filename = `${document.id}.${fileExt}`
      const path = `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`
      const isFileExists = await RNFetchBlob.fs.exists(path)

      if (!isFileExists) {
        await downloadFile(document.url, path)
      }

      await FileViewer.open(path)
    } catch (error) {
      // Ignore error if user canceled the file download
      if ((error as Error)?.message === "canceled") {
        return
      }

      console.error(error)
    }
  }

  const cancelDownload = () => {
    if (downloadTask.current) {
      downloadTask.current.cancel((error) => {
        if (error) {
          console.error(error)
        }
      })
    }
  }

  // Cancel the file download if the component is unmounted
  useEffect(() => {
    return () => {
      cancelDownload()
    }
  }, [])

  return (
    <Touchable disabled={isDownloading} onPress={isSelectModeActive ? onPress : openFile}>
      <Flex mb={4} pl={2} opacity={selectedToAdd ? 0.4 : 1}>
        <Flex height={200} position="relative">
          <Flex flex={1} bg="black10" />
          <Flex
            position="absolute"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <FileTypeIcon fileType={fileExtension} />
          </Flex>
          {isDownloading && (
            <Flex
              width="100%"
              height="100%"
              position="absolute"
              justifyContent="center"
              alignItems="center"
              bg="rgba(0, 0, 0, 0.5)"
            >
              <ActivityIndicator accessibilityLabel="Loading Indicator" />
              <Button size="small" mt={2} onPress={cancelDownload}>
                Cancel
              </Button>
            </Flex>
          )}
        </Flex>
        <Text italic variant="xs" color="onBackgroundMedium" mt={1}>
          {document.title}
        </Text>
        <Text variant="xs" color="onBackgroundMedium">
          {formattedSize}
        </Text>
      </Flex>
      {selectedToAdd && (
        <Flex position="absolute" top={1} right={1} alignItems="center" justifyContent="center">
          <CheckCircleFillIcon height={30} width={30} fill="blue100" />
        </Flex>
      )}
    </Touchable>
  )
}
