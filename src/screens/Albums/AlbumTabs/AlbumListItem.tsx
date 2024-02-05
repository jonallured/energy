import {
  Spacer,
  Flex,
  Text,
  CheckCircleFillIcon,
  Touchable,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { FadeIn } from "components/Animations/FadeIn"
import { ScrollView } from "react-native"
import { isTablet } from "react-native-device-info"
import { useAlbum } from "screens/Albums/useAlbum"
import { Album } from "system/store/Models/AlbumsModel"
import { CachedImage } from "system/wrappers/CachedImage"
import { getImageDimensions } from "utils/getImageDimensions"

interface AlbumListItemProps {
  album: Album
  selectedToAdd?: boolean
  onPress?: (albumId: string) => void
}

export const AlbumListItem: React.FC<AlbumListItemProps> = ({
  album,
  selectedToAdd,
  onPress,
}) => {
  const { artworks, installs } = useAlbum({
    albumId: album.id,
  })
  const placeholderHeight = useScreenDimensions().height / 5
  const space = useSpace()
  const variant = isTablet() ? "sm" : "xs"

  const totalItemsInAlbum = album.items.length

  return (
    <>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={{
          marginLeft: -space(2),
          marginRight: -space(2),
          paddingHorizontal: space(2),
        }}
      >
        <Flex flexDirection="row" alignItems="flex-end">
          {artworks.map((artwork, index) => {
            if (!artwork) {
              return null
            }

            return (
              <Touchable
                key={index}
                onPress={() => {
                  onPress?.(album.id)
                }}
              >
                <Flex
                  pr={1}
                  key={artwork.internalID}
                  height={230}
                  maxHeight={230}
                >
                  <CachedImage
                    uri={artwork.image?.resized?.url as string}
                    style={{ maxHeight: 230 }}
                    height={230}
                    aspectRatio={artwork.image?.aspectRatio}
                    placeholderHeight={placeholderHeight}
                    backgroundColor="transparent"
                    resizeMode="contain"
                    justifyContent="flex-end"
                  />
                </Flex>
              </Touchable>
            )
          })}

          {installs.map((install, index) => {
            const maxHeight = 230

            const { width, height, aspectRatio } = getImageDimensions({
              width: install.width as number,
              height: install.height as number,
              maxHeight,
            })

            return (
              <Touchable
                key={index}
                onPress={() => {
                  onPress?.(album.id)
                }}
              >
                <Flex
                  pr={1}
                  key={install.internalID}
                  width={width}
                  height={maxHeight}
                >
                  <CachedImage
                    uri={install.url as string}
                    width={width}
                    height={height}
                    aspectRatio={aspectRatio}
                    backgroundColor="transparent"
                    resizeMode="contain"
                    justifyContent="flex-start"
                  />
                </Flex>
              </Touchable>
            )
          })}
        </Flex>
      </ScrollView>

      <Touchable
        onPress={() => {
          onPress?.(album.id)
        }}
      >
        <Flex mt={1}>
          <Text variant="sm">{album.name}</Text>
          <Text variant={variant} color="onBackgroundMedium">
            {totalItemsInAlbum} {totalItemsInAlbum === 1 ? "Item" : "Items"}
          </Text>
        </Flex>
      </Touchable>

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
    </>
  )
}
