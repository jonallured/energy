import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { AddArtworkToAlbumQuery } from "__generated__/AddArtworkToAlbumQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { AlbumListItem, Header } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Button, CheckCircleFillIcon, Flex, Touchable, useSpace } from "palette"

type HomeTabsRoute = RouteProp<HomeTabsScreens, "AddArtworkToAlbum">
type AddArtworkToAlbumProps = {
  slug: string
}

export const AddArtworkToAlbum: React.FC<AddArtworkToAlbumProps> = () => {
  const { slug } = useRoute<HomeTabsRoute>().params
  const artworkData = useLazyLoadQuery<AddArtworkToAlbumQuery>(addArtworkToAlbumQuery, { slug })
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const safeAreaInsets = useSafeAreaInsets()
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const space = useSpace()

  const selectAlbumHandler = (albumId: string) => {
    if (!selectedAlbumIds.includes(albumId)) {
      setSelectedAlbumIds([...selectedAlbumIds, albumId])
    } else {
      const unselectedAlbumIds = selectedAlbumIds.filter((id) => id !== albumId)
      setSelectedAlbumIds(unselectedAlbumIds)
    }
  }

  const addArtworkToTheSelectedAlbums = async () => {
    try {
      setLoading(false)
      await GlobalStore.actions.albums.addArtworksInAlbums({
        albumIds: selectedAlbumIds,
        artworkIdsToAdd: [artworkData.artwork?.internalID!],
      })
      setLoading(true)
      navigation.goBack()
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  return (
    <>
      <Header label={artworkData.artwork?.title!} />
      <FlatList
        data={albums}
        keyExtractor={(item) => item?.id}
        renderItem={({ item: album }) => {
          return (
            <Flex key={album.id} mx={2}>
              {/* Condition to only display album when the artwork is not included already */}
              {!album.artworkIds.includes(artworkData.artwork?.internalID!) ? (
                <Touchable onPress={() => selectAlbumHandler(album.id)}>
                  {/* Change opacity based on selection */}
                  <Flex mb={3} mt={1} opacity={selectedAlbumIds.includes(album.id) ? 0.4 : 1}>
                    <AlbumListItem album={album} />
                  </Flex>
                  {selectedAlbumIds.includes(album.id) ? (
                    <Flex
                      position="absolute"
                      top={2}
                      right={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <CheckCircleFillIcon height={30} width={30} fill="blue100" />
                    </Flex>
                  ) : null}
                </Touchable>
              ) : null}
            </Flex>
          )
        }}
        style={{
          marginBottom: space(12) + space(2),
          marginTop: space(2),
        }}
      />
      <Flex
        position="absolute"
        bottom={0}
        px={2}
        pt={2}
        pb={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 2}
        width="100%"
      >
        <Button
          block
          onPress={addArtworkToTheSelectedAlbums}
          disabled={selectedAlbumIds.length <= 0 || loading}
        >
          Add
        </Button>
      </Flex>
    </>
  )
}

const addArtworkToAlbumQuery = graphql`
  query AddArtworkToAlbumQuery($slug: String!) {
    artwork(id: $slug) {
      internalID
      title
    }
  }
`
