import {
  CheckCircleFillIcon,
  Flex,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { FileTypeIcon } from "components/FileTypeIcon"
import { last } from "lodash"
import { useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import FileViewer from "react-native-file-viewer"
import { GlobalStore } from "system/store/GlobalStore"
import { initDownloadFileToCache } from "system/sync/fileCache"
import { useOfflineCachedURI } from "system/sync/fileCache/useOfflineCachedURI"
import { formatBytes } from "utils/formatBytes"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

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

export const DocumentGridItem = ({
  document,
  selectedToAdd,
  onPress,
}: DocumentGridItemProps) => {
  const [isOpening, setIsOpening] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const formattedSize = formatBytes(document.size)
  const fileExtension = last(document.url.split("."))
  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )
  const userAccessToken = GlobalStore.useAppState(
    (state) => state.auth.userAccessToken
  )!

  const localUri = useOfflineCachedURI(document.url, "document")

  const { downloadFileToCache } = initDownloadFileToCache({
    onFileDownloadError: (file) => {
      console.error("[DocumentGridItem] Error downloading file", file)
    },
  })

  const openFile = async () => {
    setIsOpening(true)

    const isFileCached = localUri !== undefined

    if (!isFileCached) {
      setIsDownloading(true)

      await downloadFileToCache({
        url: document.url,
        type: "document",
        accessToken: userAccessToken,
      })

      setIsDownloading(false)
    }
  }

  useEffect(() => {
    if (isOpening && !isDownloading && localUri !== undefined) {
      FileViewer.open(localUri)
      setIsOpening(false)
    }
  }, [isDownloading, isOpening, localUri])

  const isDarkMode = useIsDarkMode()

  return (
    <Touchable
      disabled={isDownloading}
      onPress={isSelectModeActive ? onPress : openFile}
    >
      <Flex mb={4} opacity={selectedToAdd ? 0.4 : 1} width="100%">
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
          {!!isDownloading && (
            <Flex
              width="100%"
              height="100%"
              position="absolute"
              justifyContent="center"
              alignItems="center"
              bg="rgba(0, 0, 0, 0.5)"
            >
              <ActivityIndicator
                accessibilityLabel="Loading Indicator"
                color={isDarkMode ? "white" : "black"}
              />
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
      {!!selectedToAdd && (
        <Flex
          position="absolute"
          top={1}
          right={1}
          alignItems="center"
          justifyContent="center"
        >
          <CheckCircleFillIcon height={30} width={30} fill="blue100" />
        </Flex>
      )}
    </Touchable>
  )
}
