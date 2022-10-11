import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { AddArtworksToAlbumQuery } from "__generated__/AddArtworksToAlbumQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { AlbumListItem, Header } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Button, CheckCircleFillIcon, Flex, Touchable, useSpace } from "palette"

type HomeTabsRoute = RouteProp<HomeTabsScreens, "AddArtworksToAlbum">
type AddArtworksToAlbumProps = {
  slug: string
}

export const AddArtworksToAlbum: React.FC<AddArtworksToAlbumProps> = () => {
  const { slug, areMultipleArtworks, name, contextArtworkSlugs, closeBottomSheetModal } =
    useRoute<HomeTabsRoute>().params

  const selectedWorks = GlobalStore.useAppState((state) => state.selectMode.items.works)

  const artworkData = !areMultipleArtworks
    ? useLazyLoadQuery<AddArtworksToAlbumQuery>(addArtworksToAlbumQuery, {
        slug,
      })
    : null

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const safeAreaInsets = useSafeAreaInsets()
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([])
  const space = useSpace()

  const selectAlbumHandler = (albumId: string) => {
    if (!selectedAlbumIds.includes(albumId)) {
      setSelectedAlbumIds([...selectedAlbumIds, albumId])
    } else {
      const unselectedAlbumIds = selectedAlbumIds.filter((id) => id !== albumId)
      setSelectedAlbumIds(unselectedAlbumIds)
    }
  }

  const addArtworkToTheSelectedAlbums = () => {
    try {
      if (areMultipleArtworks) {
        GlobalStore.actions.albums.addArtworksInAlbums({
          albumIds: selectedAlbumIds,
          artworkIdsToAdd: selectedWorks,
        })
        navigation.navigate("ArtistTabs", {
          slug,
          name,
        })
        closeBottomSheetModal?.()
        GlobalStore.actions.selectMode.cancelSelectMode()
      } else {
        GlobalStore.actions.albums.addArtworksInAlbums({
          albumIds: selectedAlbumIds,
          artworkIdsToAdd: [artworkData?.artwork?.internalID!],
        })
        navigation.goBack()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const renderButton = () => {
    if (
      albums.filter((album) => album.artworkIds?.includes(artworkData?.artwork?.internalID!))
        .length === albums.length ||
      selectedAlbumIds.length <= 0
    ) {
      return (
        <Button
          block
          onPress={() => {
            navigation.navigate("CreateOrEditAlbum", {
              mode: "create",
              artworkFromArtistTab: artworkData?.artwork?.internalID,
              slug,
              name,
              contextArtworkSlugs,
              closeBottomSheetModal,
            })
          }}
        >
          Create New Album
        </Button>
      )
    }
    return (
      <Button block onPress={addArtworkToTheSelectedAlbums}>
        Add
      </Button>
    )
  }

  return (
    <>
      <Header
        label={!areMultipleArtworks ? artworkData?.artwork?.title! : "Add to Album"}
        safeAreaInsets
      />
      <FlatList
        data={albums}
        keyExtractor={(item) => item?.id}
        renderItem={({ item: album }) => {
          return (
            <Flex key={album.id} mx={2}>
              <Touchable
                onPress={
                  album.artworkIds?.includes(artworkData?.artwork?.internalID)
                    ? undefined
                    : () => selectAlbumHandler(album.id)
                }
              >
                {/* Change opacity based on selection */}
                <Flex
                  mb={3}
                  mt={1}
                  opacity={
                    selectedAlbumIds.includes(album.id) ||
                    album.artworkIds?.includes(artworkData?.artwork?.internalID)
                      ? 0.4
                      : 1
                  }
                >
                  <AlbumListItem album={album} />
                </Flex>
                {selectedAlbumIds.includes(album.id) && (
                  <Flex
                    position="absolute"
                    top={2}
                    right={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CheckCircleFillIcon height={30} width={30} fill="blue100" />
                  </Flex>
                )}
              </Touchable>
            </Flex>
          )
        }}
        style={{
          top: space(2),
          marginBottom: space(12),
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
        {renderButton()}
      </Flex>
    </>
  )
}

const addArtworksToAlbumQuery = graphql`
  query AddArtworksToAlbumQuery($slug: String!) {
    artwork(id: $slug) {
      internalID
      title
    }
  }
`
