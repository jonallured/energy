import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { intersection } from "lodash"
import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { CreateOrEditAlbumChooseArtworksQuery } from "__generated__/CreateOrEditAlbumChooseArtworksQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { artistArtworksQuery } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/ArtistArtworks"
import { Header } from "app/sharedUI"
import { ArtworkGridItem } from "app/sharedUI/items/ArtworkGridItem"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex, Spacer, Button, Text, useSpace } from "palette"
import { extractNodes } from "shared/utils/extractNodes"
import { useArtworksByMode } from "./useArtworksByMode"

type CreateOrEditAlbumChooseArtworksRoute = RouteProp<
  HomeTabsScreens,
  "CreateOrEditAlbumChooseArtworks"
>

export const CreateOrEditAlbumChooseArtworks = () => {
  const { mode, slug, albumId } = useRoute<CreateOrEditAlbumChooseArtworksRoute>().params
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artworksData = useLazyLoadQuery<ArtistArtworksQuery>(artistArtworksQuery, {
    partnerID,
    slug,
  })
  const artworks = extractNodes(artworksData.partner?.artworksConnection)
  const artistNameData = useLazyLoadQuery<CreateOrEditAlbumChooseArtworksQuery>(artistNameQuery, {
    slug,
  })

  const safeAreaInsets = useSafeAreaInsets()
  const space = useSpace()

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)

  const selectedArtworks = useArtworksByMode(mode, slug)
  const selectedArtworksForThisArtist = intersection(
    artworks.map((artwork) => artwork.internalID),
    selectedArtworks
  )
  const [selectedArtworkIds, setSelectedArtworkIds] = useState(selectedArtworksForThisArtist)
  const [areAllArtworkSelected, setAreAllArtworkSelected] = useState<boolean>(false)

  const selectArtworkHandler = (artworkId: string) => {
    if (!selectedArtworkIds.includes(artworkId)) {
      setSelectedArtworkIds([...selectedArtworkIds, artworkId])
      setAreAllArtworkSelected(false)
    } else {
      const unselectedArtworkIds = selectedArtworkIds.filter((id) => id !== artworkId)
      setSelectedArtworkIds(unselectedArtworkIds)
      setAreAllArtworkSelected(false)
    }
  }

  const selectAllArtworkHandler = (toggleSelectAllArtwork: boolean) => {
    if (toggleSelectAllArtwork) {
      setSelectedArtworkIds(artworks.map((artwork) => artwork.internalID))
    } else {
      setSelectedArtworkIds([])
    }
    setAreAllArtworkSelected(toggleSelectAllArtwork)
  }

  const selectArtworksToAddToAnAlbum = () => {
    const currentArtworks = {
      artistSlug: slug,
      artworkIds: selectedArtworkIds,
    }
    if (mode === "edit" && albumId) {
      GlobalStore.actions.albums.selectArtworksForExistingAlbum(currentArtworks)
    } else {
      GlobalStore.actions.albums.selectArtworksForNewAlbum(currentArtworks)
    }
    navigation.navigate("CreateOrEditAlbum", { mode, albumId })
  }

  return (
    <>
      <Header
        label={mode === "edit" ? "Save to Album" : "Add to Album"}
        rightElements={
          <Button size="small" onPress={() => selectAllArtworkHandler(!areAllArtworkSelected)}>
            {selectedArtworkIds.length === artworks.length ? "Unselect All" : "Select All"}
          </Button>
        }
        safeAreaInsets
      />
      <Spacer mt={2} />
      <MasonryList
        contentContainerStyle={{
          marginTop: space(2),
          paddingRight: space(2),
        }}
        numColumns={2}
        data={artworks}
        keyExtractor={(item) => item?.internalID}
        renderItem={({ item: artwork }) => {
          if (album?.artworkIds.includes(artwork.internalID)) {
            return <ArtworkGridItem artwork={artwork} disable />
          }
          return (
            <ArtworkGridItem
              artwork={artwork}
              onPress={() => selectArtworkHandler(artwork.internalID)}
              selectedToAdd={selectedArtworkIds.includes(artwork.internalID)}
            />
          )
        }}
      />
      <Flex px={2} pt={1} pb={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 2}>
        <Text variant="xs" color="black60" mb={1} textAlign="center">
          Selected artworks for {artistNameData.artist?.name}: {selectedArtworkIds.length}
        </Text>
        <Button
          block
          onPress={selectArtworksToAddToAnAlbum}
          disabled={selectedArtworkIds.length <= 0}
        >
          {mode === "edit" ? "Save" : "Add"}
        </Button>
      </Flex>
    </>
  )
}

export const artistNameQuery = graphql`
  query CreateOrEditAlbumChooseArtworksQuery($slug: String!) {
    artist(id: $slug) {
      name
    }
  }
`
