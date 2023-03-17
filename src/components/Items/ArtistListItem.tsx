import { Avatar, Flex, FlexProps, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import {
  ArtistListItem_artist$data,
  ArtistListItem_artist$key,
} from "__generated__/ArtistListItem_artist.graphql"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"
import { useLocalUri } from "system/sync/fileCache/useLocalUri"

export interface ArtistListItemProps extends FlexProps {
  artist: ArtistListItem_artist$key
  count: string
  onPress: (item: ArtistListItem_artist$data) => void
}

export const ArtistListItem: React.FC<ArtistListItemProps> = ({ artist, count, onPress }) => {
  const data = useFragment<ArtistListItem_artist$key>(ArtistListItemFragment, artist)
  const variant = isTablet() ? "sm" : "xs"
  const src = useLocalUri(data.imageUrl!)
  const screenWidth = useWindowDimensions().width
  const space = useSpace()
  const width = isTablet() ? (screenWidth - 2 * space(2)) / 2 : undefined

  const handlePress = () => {
    if (onPress) {
      onPress(data)
    }
  }

  return (
    <Touchable onPress={handlePress} style={{ width }}>
      <Flex py={1} flexDirection="row" width="100%">
        <Avatar src={src} size={variant} initials={src ? "" : data.initials!} />
        <Flex mx={1}>
          <Text variant={variant}>{data.name}</Text>
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
    imageUrl
    initials
  }
`
