import { graphql, useLazyLoadQuery } from "react-relay"
import { Flex, Text } from "palette"
import { extractNodes } from "helpers/utils/extractNodes"
import { TabsFlatList } from "helpers/components/TabsTestWrappers"
import MasonryList from "@react-native-seoul/masonry-list"
import { WorksQuery } from "__generated__/WorksQuery.graphql"
import { Dimensions, Image } from "react-native"

export const DEFAULT_SECTION_MARGIN = 20

export const Works = ({ slug }: { slug: string }) => {
  const works = worksQuery(slug)

  return (
    <TabsFlatList // We still want to use TabFlatlist for collapsible header feature
      data={[0]} // This should be 0 as TabsFlatlist needs atleast a single data
      renderItem={() => (
        <MasonryList
          testID="artist-artwork-list"
          contentContainerStyle={{
            marginTop: 20,
            paddingLeft: 20,
          }}
          numColumns={2}
          data={works}
          renderItem={({ item: work }) => <ArtworkThumbnail work={work} />}
          keyExtractor={(item) => item.internalID!}
        />
      )}
    />
  )
}

const worksQuery = (slug: string) => {
  const data = useLazyLoadQuery<WorksQuery>(
    graphql`
      query WorksQuery($slug: String!) {
        artist(id: $slug) {
          artworksConnection(first: 100) {
            edges {
              node {
                internalID
                title
                date
                image {
                  url
                  aspectRatio
                }
              }
            }
          }
        }
      }
    `,
    { slug }
  )

  return extractNodes(data.artist?.artworksConnection)
}

interface ArtworkThumbnailProps {
  work: {
    title: string
    date: string
    image: {
      url: string
      aspectRatio: number
    }
  }
}

export const ArtworkThumbnail: React.FC<ArtworkThumbnailProps> = ({ work }) => {
  const width = Dimensions.get("window").width
  return (
    <Flex width={width / 2} mb={4}>
      <Image
        source={{ uri: Image.resolveAssetSource({ uri: work.image?.url! }).uri }}
        style={{
          aspectRatio: work.image?.aspectRatio ?? 1,
          width: "80%",
        }}
      />
      <Text italic variant="xs" color="black60" mt={1} mr={2}>
        {work.title},{" "}
        <Text variant="xs" color="black60">
          {work.date}
        </Text>
      </Text>
    </Flex>
  )
}
