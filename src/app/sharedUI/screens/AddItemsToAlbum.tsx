import { Button, CheckCircleFillIcon, Flex, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useLazyLoadQuery } from "react-relay"
import { AddItemsToAlbumQuery } from "__generated__/AddItemsToAlbumQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { AlbumListItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Screen } from "palette"

type HomeTabsRoute = RouteProp<NavigationScreens, "AddItemsToAlbum">

export const AddItemsToAlbum = () => {
  const { slug, areMultipleArtworks, name, contextArtworkSlugs, closeBottomSheetModal } =
    useRoute<HomeTabsRoute>().params

  const selectedWorks = GlobalStore.useAppState((state) => state.selectMode.items.works)
  const selectedDocs = GlobalStore.useAppState((state) => state.selectMode.items.documents)

  const artworkData = !areMultipleArtworks
    ? useLazyLoadQuery<AddItemsToAlbumQuery>(addItemsToAlbumQuery, { slug })
    : null

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
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
        GlobalStore.actions.albums.addItemsInAlbums({
          albumIds: selectedAlbumIds,
          artworkIdsToAdd: selectedWorks,
          documentIdsToAdd: selectedDocs,
          installShotUrlsToAdd: [],
        })
        navigation.goBack()
        closeBottomSheetModal?.()
        GlobalStore.actions.selectMode.cancelSelectMode()
      } else {
        GlobalStore.actions.albums.addItemsInAlbums({
          albumIds: selectedAlbumIds,
          artworkIdsToAdd: [artworkData?.artwork?.internalID!],
          documentIdsToAdd: [],
          installShotUrlsToAdd: [],
        })
        navigation.goBack()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const renderButton = () => {
    if (
      albums.filter((album) => album.artworkIds.includes(artworkData?.artwork?.internalID!))
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
    <Screen>
      <Screen.Header title={!areMultipleArtworks ? artworkData?.artwork?.title! : "Add to Album"} />
      <Screen.Body fullwidth>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: space("2") }}
          data={albums}
          keyExtractor={(item) => item?.id}
          renderItem={({ item: album }) => {
            return (
              <Flex key={album.id}>
                <Touchable
                  onPress={
                    album.artworkIds.includes(artworkData?.artwork?.internalID)
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
                      album.artworkIds.includes(artworkData?.artwork?.internalID)
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

        <Screen.BottomView>{renderButton()}</Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}

const addItemsToAlbumQuery = graphql`
  query AddItemsToAlbumQuery($slug: String!) {
    artwork(id: $slug) {
      internalID
      title
    }
  }
`
