import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeftIcon, Flex, Separator, Spacer, Text, Touchable } from "palette"
import { Suspense } from "react"
import { ActivityIndicator, Image, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { HomeTabsScreens } from "routes/HomeTabsNavigationStack"
import { ArtworkQuery } from "__generated__/ArtworkQuery.graphql"

type ArtworkRoute = RouteProp<HomeTabsScreens, "Artwork">

export const Artwork = () => {
  const { slug } = useRoute<ArtworkRoute>().params

  return (
    <Suspense
      fallback={
        <Flex justifyContent={"center"} flex={1}>
          <ActivityIndicator />
        </Flex>
      }
    >
      <RenderArtwork slug={slug} />
    </Suspense>
  )
}

type RenderArtworkProps = {
  slug: string
}

const RenderArtwork: React.FC<RenderArtworkProps> = ({ slug }) => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const artworkData = useLazyLoadQuery<ArtworkQuery>(artworkQuery, { slug })

  return (
    <Flex flex={1} pt={insets.top} px={2} mt={2}>
      <Touchable
        onPress={() => {
          navigation.goBack()
        }}
      >
        <ArrowLeftIcon fill="black100" />
      </Touchable>
      <Flex mt={2}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{
              uri: Image.resolveAssetSource({ uri: artworkData.artwork?.image?.url! }).uri,
            }}
            style={{
              aspectRatio: artworkData.artwork?.image?.aspectRatio ?? 1,
            }}
          />
          <Spacer mt={2} />
          <Separator />
          <Spacer mt={2} />
          <Text>{artworkData.artwork?.artist?.name}</Text>
          <Text italic color="black60">
            {artworkData.artwork?.title}, <Text color="black60">{artworkData.artwork?.date}</Text>
          </Text>
          <Spacer mt={0.5} />
          <Text weight="medium">{artworkData.artwork?.price || "$0"}</Text>
          <Spacer mt={0.5} />
          <Text variant="xs" color="black60">
            {artworkData.artwork?.mediumType?.name}
          </Text>
          {(artworkData.artwork?.dimensions?.in || artworkData.artwork?.dimensions?.cm) && (
            <Text variant="xs" color="black60">
              {artworkData.artwork?.dimensions?.in} - {artworkData.artwork?.dimensions?.cm}
            </Text>
          )}
          <Spacer mt={2} />
          <Separator />
          <Spacer mt={2} />
          {artworkData.artwork?.inventoryId && (
            <>
              <Text variant="xs">Inventory ID</Text>
              <Text variant="xs" color="black60">
                {artworkData.artwork?.inventoryId}
              </Text>
              <Spacer mt={2} />
              <Separator />
            </>
          )}
        </ScrollView>
      </Flex>
    </Flex>
  )
}

const artworkQuery = graphql`
  query ArtworkQuery($slug: String!) {
    artwork(id: $slug) {
      image {
        url
        aspectRatio
      }
      title
      price
      date
      mediumType {
        name
      }
      dimensions {
        in
        cm
      }
      inventoryId
      artist {
        name
      }
    }
  }
`
