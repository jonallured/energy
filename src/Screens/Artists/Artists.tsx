import { Suspense } from "react"
import { Tab, Tabs } from "react-native-collapsible-tab-view"
import { Avatar, Flex, Text } from "palette"
import { ActivityIndicator, FlatList } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { GlobalStore } from "store/GlobalStore"
import { extractNodes } from "helpers/utils/extractNodes"
import { TabsFlatList } from "helpers/components/TabsWrapper"

export const Artists = () => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!

  const data = useLazyLoadQuery<ArtistsQuery>(
    graphql`
      query ArtistsQuery($partnerID: String!) {
        partner(id: $partnerID) {
          allArtistsConnection {
            totalCount
            edges {
              node {
                internalID
                name
                imageUrl
                initials
                counts {
                  artworks
                }
              }
            }
          }
        }
      }
    `,
    { partnerID }
  )

  const artists = extractNodes(data.partner?.allArtistsConnection)

  return (
    <TabsFlatList
      data={artists}
      renderItem={({ item: artist }) => <ArtistThumbnail artist={artist} />}
      keyExtractor={(item) => item?.internalID!}
    />
  )
}

interface ArtistThumbnailProps {
  artist: NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<
          NonNullable<ArtistsQuery["response"]["partner"]>["allArtistsConnection"]
        >["edges"]
      >[0]
    >["node"]
  >
}

export const ArtistThumbnail: React.FC<ArtistThumbnailProps> = ({ artist }) => {
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

export const ArtistsScreen = () => (
  <Suspense fallback={<TabsFlatList data={[0]} renderItem={() => <ActivityIndicator />} />}>
    <Artists />
  </Suspense>
)
