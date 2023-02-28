import { Avatar, Flex, Text } from "@artsy/palette-mobile"
import { ArtistListItem_artist$key } from "__generated__/ArtistListItem_artist.graphql"
import { useLocalUri } from "app/system/sync/fileCache"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface ArtistListItemProps {
  artist: ArtistListItem_artist$key
  count: string
}

export const ArtistListItem: React.FC<ArtistListItemProps> = (props) => {
  const artist = useFragment<ArtistListItem_artist$key>(ArtistListItemFragment, props.artist)
  const variant = isTablet() ? "sm" : "xs"
  const src = useLocalUri(artist.imageUrl!)
  return (
    <Flex py={1} flexDirection="row">
      <Avatar src={src} size={variant} initials={src ? "" : artist.initials!} />
      <Flex mx={1}>
        <Text variant={variant}>{artist.name}</Text>
        <Text variant={variant} color="onBackgroundMedium">
          {props.count} Artworks
        </Text>
      </Flex>
    </Flex>
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
