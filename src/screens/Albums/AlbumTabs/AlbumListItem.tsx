import { Spacer, Flex, Text, CheckCircleFillIcon, Touchable, Box } from "@artsy/palette-mobile"
import { FadeIn } from "components/Animations/FadeIn"
import { isTablet } from "react-native-device-info"
import { useAlbum } from "screens/Albums/useAlbum"
import { Album } from "system/store/Models/AlbumsModel"
import { CachedImage } from "system/wrappers/CachedImage"
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

  return (
    <>
      <Touchable
        onPress={() => {
          onPress?.(album.id)
        }}
      >
        <Flex flexDirection="row" alignItems="flex-end">
          {first3Artworks.reverse().map((artwork) => {
            if (!artwork) {
              return null
            }
            const imageWidth = artwork?.image?.resized?.width! / 3

            return (
              <Box width={imageWidth} pr={1} key={artwork.internalID}>
                <CachedImage
                  uri={artwork.image?.resized?.url as string}
                  aspectRatio={artwork.image?.aspectRatio}
                  placeholderHeight={placeholderHeight}
                  resizeMode="cover"
                />
              </Box>
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

        {!!selectedToAdd && (
          <Flex
            position="absolute"
            right={0}
            alignItems="center"
            justifyContent="center"
            backgroundColor="white"
            borderRadius={1000}
          >
            <FadeIn>
              <CheckCircleFillIcon height={30} width={30} fill="blue100" />
            </FadeIn>
          </Flex>
        )}
      </Touchable>
    </>
  )
}
