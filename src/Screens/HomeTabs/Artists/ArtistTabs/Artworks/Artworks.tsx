import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { Flex, Text } from "palette"
import { extractNodes } from "shared/utils/extractNodes"
import { TabsFlatList } from "Screens/_helpers/TabsTestWrappers"
import MasonryList from "@react-native-seoul/masonry-list"
import { Image } from "react-native"
import { ArtworksQuery } from "__generated__/ArtworksQuery.graphql"
import { Artworks_artwork$key } from "__generated__/Artworks_artwork.graphql"

export const Artworks = ({ slug }: { slug: string }) => {
  const artworksData = useLazyLoadQuery<ArtworksQuery>(artworksQuery, { slug })
  const artworks = extractNodes(artworksData.artist?.artworksConnection)

  return (
    <TabsFlatList // We still want to use TabFlatlist for collapsible header feature
      data={[0]} // This should be 0 as TabsFlatlist needs atleast a single data
      renderItem={() => (
        <MasonryList
          testID="artist-artwork-list"
          contentContainerStyle={{
            marginTop: 20,
            paddingRight: 20,
          }}
          numColumns={2}
          data={artworks}
          renderItem={({ item: artwork }) => <ArtworkThumbnail artwork={artwork} />}
          keyExtractor={(item) => item.internalID!}
        />
      )}
    />
  )
}

const artworksQuery = graphql`
  query ArtworksQuery($slug: String!) {
    artist(id: $slug) {
      artworksConnection(first: 100) {
        edges {
          node {
            internalID
            ...Artworks_artwork
          }
        }
      }
    }
  }
`

interface ArtworkThumbnailProps {
  artwork: Artworks_artwork$key
}

export const ArtworkThumbnail: React.FC<ArtworkThumbnailProps> = (props) => {
  const artwork = useFragment<Artworks_artwork$key>(ArtworkThumbnailFragment, props.artwork)
  return (
    <Flex mb={4} pl={2}>
      <Image
        source={{ uri: Image.resolveAssetSource({ uri: artwork.image?.url! }).uri }}
        style={{
          aspectRatio: artwork.image?.aspectRatio ?? 1,
        }}
      />
      <Text italic variant="xs" color="black60" mt={1}>
        {artwork.title},{" "}
        <Text variant="xs" color="black60">
          {artwork.date}
        </Text>
      </Text>
    </Flex>
  )
}

const ArtworkThumbnailFragment = graphql`
  fragment Artworks_artwork on Artwork {
    internalID
    title
    date
    image {
      url
      aspectRatio
    }
  }
`
