import {
  Spacer,
  Flex,
  Text,
  SpacingUnitDSValue,
  CheckCircleFillIcon,
  Touchable,
} from "@artsy/palette-mobile"
import { isTablet } from "react-native-device-info"
import Animated from "react-native-reanimated"
import { useAlbum } from "screens/Albums/useAlbum"
import { Album } from "system/store/Models/AlbumsModel"
import { CachedImage } from "system/wrappers/CachedImage"
import { useFadeInAnimation } from "utils/hooks/animations/useFadeInAnimation"
import { useScreenDimensions } from "utils/hooks/useScreenDimensions"

interface AlbumListItemProps {
  album: Album
  selectedToAdd?: boolean
  onPress?: (albumId: string) => void
}

export const AlbumListItem: React.FC<AlbumListItemProps> = ({ album, selectedToAdd, onPress }) => {
  const { artworks } = useAlbum({ albumId: album.id })
  const placeholderHeight = useScreenDimensions().height / 5
  const first3Artworks = artworks.slice(0, 3)
  const variant = isTablet() ? "sm" : "xs"
  const overlapSize: SpacingUnitDSValue = 2
  const { fadeInStyles } = useFadeInAnimation({ startAnimation: selectedToAdd })

  return (
    <Touchable
      onPress={() => {
        onPress?.(album.id)
      }}
    >
      <Flex>
        <Flex flexDirection="row-reverse" alignItems="flex-end" overflow="hidden">
          {first3Artworks.length < 3 && (
            <Flex
              backgroundColor="black60"
              flex={1}
              height={150}
              mr={-overlapSize as SpacingUnitDSValue}
            />
          )}
          {first3Artworks.length < 2 && (
            <Flex
              backgroundColor="black30"
              flex={1}
              height={100}
              mr={-overlapSize as SpacingUnitDSValue}
            />
          )}
          {first3Artworks.reverse().map((artwork) => {
            if (!artwork) {
              return null
            }

            return (
              <CachedImage
                key={artwork.internalID}
                uri={artwork.image?.resized?.url as string}
                aspectRatio={artwork.image?.aspectRatio}
                style={{
                  flex: 1,
                  marginRight: -overlapSize,
                  maxHeight: 150,
                }}
                placeholderHeight={placeholderHeight}
              />
            )
          })}
        </Flex>

        <Flex mt={1}>
          <Text variant={variant}>{album.name}</Text>
          <Text variant={variant} color="onBackgroundMedium">
            {artworks.length} {artworks.length === 1 ? "Item" : "Items"}
          </Text>
        </Flex>
        <Spacer y={1} />
      </Flex>

      {selectedToAdd && (
        <Flex position="absolute" top={2} right={1} alignItems="center" justifyContent="center">
          <Animated.View style={fadeInStyles}>
            <CheckCircleFillIcon height={30} width={30} fill="blue100" />
          </Animated.View>
        </Flex>
      )}
    </Touchable>
  )
}
