import { AlbumListImage } from "./AlbumListImage"
import { Album } from "app/store/Models/AlbumsModel"
import { Flex, Text, useSpace } from "palette"
import { useScreenDimensions } from "shared/hooks"

export const AlbumListItem = ({ album }: { album: Album }) => {
  const space = useSpace()
  const itemHeight = useScreenDimensions().height / 5
  const overlapSize = space("2")
  const first3Artworks = album.artworkIds.slice(0, 3)

  return (
    <>
      <Flex
        flexDirection="row-reverse"
        alignItems="flex-end"
        pl={overlapSize}
        maxHeight={itemHeight}
        overflow="hidden"
      >
        {first3Artworks.length < 3 ? (
          <Flex backgroundColor="black30" flex={1} height={itemHeight} mr={-overlapSize} />
        ) : null}
        {first3Artworks.length < 2 ? (
          <Flex backgroundColor="black30" flex={1} height={itemHeight - 50} mr={-overlapSize} />
        ) : null}
        {first3Artworks.reverse().map((artworkId) => (
          <AlbumListImage
            slug={artworkId}
            key={artworkId}
            style={{
              flex: 1,
              marginRight: -overlapSize,
            }}
          />
        ))}
      </Flex>
      <Flex mt={1}>
        <Text variant="xs">{album.name}</Text>
        <Text variant="xs" color="black60">
          {album.artworkIds.length} Artworks
        </Text>
      </Flex>
    </>
  )
}
