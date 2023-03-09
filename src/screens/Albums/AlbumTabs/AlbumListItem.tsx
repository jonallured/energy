import { Spacer, Flex, Text, SpacingUnitDSValue } from "@artsy/palette-mobile"
import { isTablet } from "react-native-device-info"
import { useAlbum } from "screens/Albums/useAlbum"
import { Album } from "system/store/Models/AlbumsModel"
import { CachedImage } from "system/wrappers/CachedImage"
import { useScreenDimensions } from "utils/hooks/useScreenDimensions"

// FIXME: move over delete functionality
// import { AlbumListImage } from "./AlbumListImage"

interface AlbumListItemProps {
  album: Album
}

export const AlbumListItem: React.FC<AlbumListItemProps> = ({ album }) => {
  const { artworks } = useAlbum({ albumId: album.id })
  const placeholderHeight = useScreenDimensions().height / 5
  const first3Artworks = artworks.slice(0, 3)
  const variant = isTablet() ? "sm" : "xs"
  const overlapSize: SpacingUnitDSValue = 2

  return (
    <Flex my={2}>
      <Flex flexDirection="row-reverse" alignItems="flex-end" pl={overlapSize} overflow="hidden">
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
  )
}
