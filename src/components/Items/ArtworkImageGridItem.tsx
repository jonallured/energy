import { CheckCircleFillIcon, Flex, FlexProps, Touchable } from "@artsy/palette-mobile"
import { ArtworkImageModal } from "components/ArtworkImageModal"
import { useState } from "react"
import { GlobalStore } from "system/store/GlobalStore"
import { CachedImage } from "system/wrappers/CachedImage"

interface ArtworkImageGridItemProps extends FlexProps {
  url: string
  onPress?: () => void
  selectedToAdd?: boolean
}

export const ArtworkImageGridItem: React.FC<ArtworkImageGridItemProps> = ({
  url,
  onPress,
  selectedToAdd,
  ...flexProps
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )

  return (
    <Flex testID={url} {...flexProps}>
      <ArtworkImageModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        uri={url}
      />

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
          <CachedImage uri={url} aspectRatio={1} />
        </Flex>

        {selectedToAdd && (
          <Flex position="absolute" top={1} right={1} alignItems="center" justifyContent="center">
            <CheckCircleFillIcon height={30} width={30} fill="blue100" />
          </Flex>
        )}
      </Touchable>
    </Flex>
  )
}
