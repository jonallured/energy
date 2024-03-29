import {
  Flex,
  FlexProps,
  Text,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
import {
  ArtistListItem_artist$data,
  ArtistListItem_artist$key,
} from "__generated__/ArtistListItem_artist.graphql"
import { Avatar } from "components/Avatar"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"
import { useOfflineCachedURI } from "system/sync/fileCache/useOfflineCachedURI"

export interface ArtistListItemProps extends FlexProps {
  artist: ArtistListItem_artist$key
  count: string
  onPress: (item: ArtistListItem_artist$data) => void
}

export const ArtistListItem: React.FC<ArtistListItemProps> = ({
  artist,
  count,
  onPress,
}) => {
  const data = useFragment<ArtistListItem_artist$key>(
    ArtistListItemFragment,
    artist
  )
  const src = useOfflineCachedURI(data.image?.resized?.url!)
  const screenWidth = useWindowDimensions().width

  const variant = isTablet() ? "sm" : "xs"
  const space = useSpace()
  const width = isTablet() ? (screenWidth - 2 * space(2)) / 2 : undefined

  const handlePress = () => {
    if (onPress) {
      onPress(data)
    }
  }

  return (
    <Touchable onPress={handlePress} style={{ width }}>
      <Flex mb={2} flexDirection="row" width="100%">
        <Avatar src={src} size={variant} initials={src ? "" : data.initials!} />
        <Flex mx={1} justifyContent="center">
          <Text variant="sm">{data.name}</Text>

          <Text variant={variant} color="onBackgroundMedium">
            {count} Artworks
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  )
}

const ArtistListItemFragment = graphql`
  fragment ArtistListItem_artist on Artist {
    internalID
    name
    slug
    image {
      resized(width: 100, height: 100) {
        url
        width
        height
      }
    }
    initials
  }
`
