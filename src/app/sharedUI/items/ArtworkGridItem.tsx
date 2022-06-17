import { graphql, useFragment } from "react-relay"
import { Flex, Text, Touchable } from "palette"
import { Image } from "react-native"
import { ArtworkGridItem_artwork$key } from "__generated__/ArtworkGridItem_artwork.graphql"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"

interface ArtworkGridItemProps {
  artwork: ArtworkGridItem_artwork$key
}

export const ArtworkGridItem: React.FC<ArtworkGridItemProps> = (props) => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const artwork = useFragment<ArtworkGridItem_artwork$key>(ArtworkGridItemFragment, props.artwork)

  return (
    <Touchable
      onPress={() => {
        navigation.navigate("Artwork", {
          slug: artwork.slug,
        })
      }}
    >
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
    </Touchable>
  )
}

const ArtworkGridItemFragment = graphql`
  fragment ArtworkGridItem_artwork on Artwork {
    internalID
    title
    date
    slug
    image {
      url
      aspectRatio
    }
  }
`