import { Avatar, Flex, Text } from "@artsy/palette-mobile"
import { graphql, useFragment } from "react-relay"
import { ArtistListItem_artist$key } from "__generated__/ArtistListItem_artist.graphql"

interface ArtistListItemProps {
  artist: ArtistListItem_artist$key
  count: string
}

export const ArtistListItem: React.FC<ArtistListItemProps> = (props) => {
  const artist = useFragment<ArtistListItem_artist$key>(ArtistListItemFragment, props.artist)
  return (
    <Flex px={2} py={1} flexDirection="row">
      <Avatar src={artist.imageUrl!} size="xs" initials={artist.imageUrl ? "" : artist.initials!} />
      <Flex mx={1}>
        <Text variant="xs">{artist.name}</Text>
        <Text variant="xs" color="onBackgroundMedium">
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
