import { Spacer } from "@artsy/palette-mobile"
import { Album } from "app/store/Models/AlbumsModel"
import { Flex, Text, useSpace } from "palette"
import { AlbumListImage } from "./AlbumListImage"

export const AlbumListItem = ({ album }: { album: Album }) => {
  const space = useSpace()
  const overlapSize = space("2")
  const first3Artworks = album.artworkIds!.slice(0, 3)

  return (
    <>
      <Flex flexDirection="row-reverse" alignItems="flex-end" pl={overlapSize} overflow="hidden">
        {first3Artworks.length < 3 && (
          <Flex backgroundColor="onBackgroundLow" flex={1} mr={-overlapSize} />
        )}
        {first3Artworks.length < 2 && (
          <Flex backgroundColor="onBackgroundLow" flex={1} mr={-overlapSize} />
        )}
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
        <Text variant="xs" color="onBackgroundMedium">
          {album.artworkIds?.length ?? 0} Artworks
        </Text>
      </Flex>
      <Spacer y={1} />
    </>
  )
}
