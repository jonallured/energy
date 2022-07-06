import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeftIcon, ArrowRightIcon, Flex, Separator, Spacer, Text, Touchable } from "palette"
import { useMemo } from "react"
import { Image, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { ArtworkQuery } from "__generated__/ArtworkQuery.graphql"
import { GlobalStore } from "app/store/GlobalStore"

type ArtworkRoute = RouteProp<HomeTabsScreens, "Artwork">

type ArtworkProps = {
  slug: string
}

export const Artwork: React.FC<ArtworkProps> = () => {
  const { slug } = useRoute<ArtworkRoute>().params

  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const artworkData = useLazyLoadQuery<ArtworkQuery>(artworkQuery, { slug })
  const albums = GlobalStore.useAppState((state) => state.albums.albums)

  const numberOfAlbumsTheArtworkAvailable = useMemo(() => {
    return albums.filter((album) => album.artworkIds.includes(artworkData.artwork?.internalID!))
      .length
  }, [albums])

  return (
    <Flex flex={1} pt={insets.top} px={2} mt={2}>
      <Touchable
        onPress={() => {
          navigation.goBack()
        }}
      >
        <ArrowLeftIcon fill="black100" />
      </Touchable>
      <Flex my={2}>
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
          {artworkData.artwork?.inventoryId ? (
            <>
              <Spacer mt={2} />
              <Text variant="xs">Inventory ID</Text>
              <Text variant="xs" color="black60">
                {artworkData.artwork?.inventoryId}
              </Text>
              <Spacer mt={2} />
              <Separator />
            </>
          ) : null}
          {albums.length !== 0 ? (
            <Touchable
              onPress={() => {
                navigation.navigate("AddArtworkToAlbum", { slug })
              }}
              disabled={numberOfAlbumsTheArtworkAvailable === albums.length}
            >
              <Spacer mt={3} />
              <Flex flexDirection="row" alignItems="center">
                <Image source={require("images/briefcase.webp")} />
                <Flex ml={1}>
                  {numberOfAlbumsTheArtworkAvailable === albums.length ? null : (
                    <Text>Add to Album</Text>
                  )}
                  {numberOfAlbumsTheArtworkAvailable === 0 ? null : (
                    <Flex flexDirection="row" alignItems="center">
                      <Text variant="xs" color="black60">
                        Currently in{" "}
                        {numberOfAlbumsTheArtworkAvailable === albums.length
                          ? "all albums"
                          : numberOfAlbumsTheArtworkAvailable === 1
                          ? "1 album"
                          : `${numberOfAlbumsTheArtworkAvailable} albums`}
                      </Text>
                    </Flex>
                  )}
                </Flex>
                {numberOfAlbumsTheArtworkAvailable === albums.length ? null : (
                  <ArrowRightIcon ml="auto" fill="black100" />
                )}
              </Flex>
              <Spacer mt={3} />
            </Touchable>
          ) : null}
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
      internalID
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
