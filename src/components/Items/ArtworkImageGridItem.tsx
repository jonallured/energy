import {
  CheckCircleFillIcon,
  Flex,
  FlexProps,
  Touchable,
} from "@artsy/palette-mobile"
import { ArtworkImageModal } from "apps/Artwork/routes/Artwork/ArtworkContent/ArtworkImageModal"
import { useState } from "react"
import { GlobalStore } from "system/store/GlobalStore"
import { CachedImage } from "system/wrappers/CachedImage"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

interface ArtworkImageGridItemProps extends FlexProps {
  url: string
  aspectRatio: number
  onPress?: () => void
  selectedToAdd?: boolean
}

export const ArtworkImageGridItem: React.FC<ArtworkImageGridItemProps> = ({
  url,
  aspectRatio,
  onPress,
  selectedToAdd,
  ...flexProps
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )

  const isDarkMode = useIsDarkMode()

  return (
    <Flex testID={url} {...flexProps}>
      {!!isModalVisible && (
        <ArtworkImageModal
          onClose={() => setIsModalVisible(false)}
          uri={url}
          isStandAlone
        />
      )}

      <Touchable
        onPress={
          isSelectModeActive
            ? onPress
            : () => {
                if (!url) return
                setIsModalVisible((v) => !v)
              }
        }
      >
        <Flex opacity={selectedToAdd ? 0.4 : 1}>
          <CachedImage
            uri={url}
            aspectRatio={aspectRatio}
            resizeMode="contain"
            backgroundColor="transparent"
          />
        </Flex>

        {!!selectedToAdd && (
          <Flex
            position="absolute"
            top={1}
            right={1}
            alignItems="center"
            justifyContent="center"
          >
            <CheckCircleFillIcon
              height={30}
              width={30}
              fill={isDarkMode ? "black15" : "blue100"}
            />
          </Flex>
        )}
      </Touchable>
    </Flex>
  )
}
