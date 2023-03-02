import { Spacer, Flex, Text, SpacingUnitDSValue } from "@artsy/palette-mobile"
import { Album } from "app/system/store/Models/AlbumsModel"
import { SelectedItemArtwork } from "app/system/store/Models/SelectModeModel"
import { isTablet } from "react-native-device-info"
import { AlbumListImage } from "./AlbumListImage"

export const AlbumListItem = ({ album }: { album: Album }) => {
  const overlapSize: SpacingUnitDSValue = 2
  const albumItems = album.items ?? []
  const first3Artworks = albumItems.slice(0, 3)
  const variant = isTablet() ? "sm" : "xs"

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
        {first3Artworks.reverse().map((item) => {
          if (!item) return null
          const artwork = item as SelectedItemArtwork

          return (
            <AlbumListImage
              slug={artwork.slug}
              key={artwork.internalID}
              style={{
                flex: 1,
                marginRight: -overlapSize,
              }}
            />
          )
        })}
      </Flex>
      <Flex mt={1}>
        <Text variant={variant}>{album.name}</Text>
        <Text variant={variant} color="onBackgroundMedium">
          {albumItems.length} {albumItems.length === 1 ? "Item" : "Items"}
        </Text>
      </Flex>
      <Spacer y={1} />
    </Flex>
  )
}
