import { Flex, Button, Text, useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { intersection } from "lodash"
import { useState } from "react"
import { graphql } from "react-relay"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { CreateOrEditAlbumChooseArtworksQuery } from "__generated__/CreateOrEditAlbumChooseArtworksQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ArtworkGridItem } from "app/components/Items/ArtworkGridItem"
import { artistArtworksQuery } from "app/screens/Artists/ArtistTabs/ArtistArtworks/ArtistArtworks"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"
import { imageSize } from "app/utils/imageSize"
import { Screen } from "palette"
import { useArtworksByMode } from "./useArtworksByMode"

type CreateOrEditAlbumChooseArtworksRoute = RouteProp<
  NavigationScreens,
  "CreateOrEditAlbumChooseArtworks"
>

export const CreateOrEditAlbumChooseArtworks = () => {
  const { mode, slug, albumId } = useRoute<CreateOrEditAlbumChooseArtworksRoute>().params
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artworksData = useSystemQueryLoader<ArtistArtworksQuery>(artistArtworksQuery, {
    partnerID,
    slug,
    imageSize,
  })
  const artworks = extractNodes(artworksData.partner?.artworksConnection)
  const artistNameData = useSystemQueryLoader<CreateOrEditAlbumChooseArtworksQuery>(
    artistNameQuery,
    {
      slug,
    }
  )

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

  // Filterering based on presentation mode
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

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
    <Screen>
      <Screen.Header
        title={mode === "edit" ? "Save to Album" : "Add to Album"}
        rightElements={
          <Button size="small" onPress={() => selectAllArtworkHandler(!areAllArtworkSelected)}>
            {selectedArtworkIds.length === artworks.length ? "Unselect All" : "Select All"}
          </Button>
        }
      />
      <Screen.Body>
        <MasonryList
          contentContainerStyle={{
            marginTop: space(2),
          }}
          numColumns={2}
          data={presentedArtworks}
          keyExtractor={(item) => item?.internalID}
          renderItem={({ item: artwork, i }) => {
            if (album?.artworkIds?.includes(artwork.internalID)) {
              return (
                <ArtworkGridItem
                  artwork={artwork}
                  disable
                  style={{
                    marginLeft: i % 2 === 0 ? 0 : space("1"),
                    marginRight: i % 2 === 0 ? space("1") : 0,
                  }}
                />
              )
            }
            return (
              <ArtworkGridItem
                artwork={artwork}
                onPress={() => selectArtworkHandler(artwork.internalID)}
                selectedToAdd={selectedArtworkIds.includes(artwork.internalID)}
                style={{
                  marginLeft: i % 2 === 0 ? 0 : space("1"),
                  marginRight: i % 2 === 0 ? space("1") : 0,
                }}
              />
            )
          }}
        />
        <Flex pt={1}>
          <Text variant="xs" color="onBackgroundMedium" mb={1} textAlign="center">
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
      </Screen.Body>
    </Screen>
  )
}

export const artistNameQuery = graphql`
  query CreateOrEditAlbumChooseArtworksQuery($slug: String!) {
    artist(id: $slug) {
      name
    }
  }
`
