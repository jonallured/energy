import { Button, Flex, Text } from "palette"
import { TabsScrollView } from "app/wrappers/TabsTestWrappers"
import { GlobalStore } from "app/store/GlobalStore"
import { graphql, useLazyLoadQuery } from "react-relay"
import { SuspenseWrapper } from "app/wrappers/SuspenseWrapper"
import { Image } from "react-native"
import { AlbumsQuery } from "__generated__/AlbumsQuery.graphql"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"

export const Albums = () => (
  <SuspenseWrapper withTabs>
    <RenderAlbums />
  </SuspenseWrapper>
)

const RenderAlbums = () => {
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation()

  return (
    <>
      <TabsScrollView>
        <Flex mx={2}>
          {albums.map((album) => (
            <Flex key={album} mb={3} mt={1} backgroundColor="orange">
              {/* {album.artworkIds.map((artworkId) => (
              <AlbumListImage slug={artworkId} key={artworkId} />
            ))} */}
              <AlbumListImage slug={album.artworkIds[0]} key={album.artworkIds[0]} />
              <Flex mt={1}>
                <Text variant="xs">{album.title}</Text>
                <Text variant="xs" color="black60">
                  {album.artworkIds.length} Artworks
                </Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </TabsScrollView>
      <Flex
        position="absolute"
        bottom={0}
        pb={safeAreaInsets.bottom}
        px={2}
        pt={2}
        width="100%"
        backgroundColor="white100"
      >
        <Button block onPress={() => navigation.navigate("CreateAlbum")}>
          Create New Album
        </Button>
      </Flex>
    </>
  )
}

const AlbumListImage = ({ slug }: { slug: string }) => {
  const albumImages = useLazyLoadQuery<AlbumsQuery>(albumsQuery, { slug })

  return (
    <Image
      source={{
        uri: Image.resolveAssetSource({ uri: albumImages.artwork?.image?.url! }).uri,
      }}
      style={{
        aspectRatio: albumImages.artwork?.image?.aspectRatio ?? 1,
      }}
    />
  )
}

const albumsQuery = graphql`
  query AlbumsQuery($slug: String!) {
    artwork(id: $slug) {
      image {
        url
        aspectRatio
      }
    }
  }
`
