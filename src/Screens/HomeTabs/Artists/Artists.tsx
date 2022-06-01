import { Avatar, Flex, Text, Touchable } from "palette"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { GlobalStore } from "store/GlobalStore"
import { extractNodes } from "helpers/utils/extractNodes"
import { TabsFlatList } from "helpers/components/TabsTestWrappers"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "routes/HomeTabsNavigationStack"
import { Artists_artist$key } from "__generated__/Artists_artist.graphql"

export const Artists = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artistsData = useLazyLoadQuery<ArtistsQuery>(artistsQuery, { partnerID })
  const artists = extractNodes(artistsData.partner?.allArtistsConnection)

  return (
    <TabsFlatList
      data={artists}
      renderItem={({ item: artist }) => (
        <Touchable
          onPress={() => {
            navigation.navigate("ArtistTabs", {
              slug: artist.slug || "",
            })
          }}
        >
          <ArtistThumbnail artist={artist} />
        </Touchable>
      )}
      keyExtractor={(item) => item?.internalID!}
    />
  )
}

const artistsQuery = graphql`
  query ArtistsQuery($partnerID: String!) {
    partner(id: $partnerID) {
      allArtistsConnection {
        totalCount
        edges {
          node {
            slug
            internalID
            ...Artists_artist
          }
        }
      }
    }
  }
`

interface ArtistThumbnailProps {
  artist: Artists_artist$key
}

export const ArtistThumbnail: React.FC<ArtistThumbnailProps> = (props) => {
  const artist = useFragment<Artists_artist$key>(ArtistThumbnailFragment, props.artist)
  return (
    <Flex px={2} py={1} flexDirection="row">
      <Avatar src={artist.imageUrl!} size="xs" initials={artist.imageUrl ? "" : artist.initials!} />
      <Flex mx={1}>
        <Text variant="xs">{artist.name}</Text>
        <Text variant="xs" color="black60">
          {artist.counts?.artworks} Artworks
        </Text>
      </Flex>
    </Flex>
  )
}

const ArtistThumbnailFragment = graphql`
  fragment Artists_artist on Artist {
    internalID
    name
    slug
    imageUrl
    initials
    counts {
      artworks
    }
  }
`
