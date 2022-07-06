import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { artistArtworksQuery } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/ArtistArtworks"
import { Header } from "app/sharedUI"
import { Flex, Spacer, Button, Text, Touchable } from "palette"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useLazyLoadQuery } from "react-relay"
import { extractNodes } from "shared/utils/extractNodes"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import MasonryList from "@react-native-seoul/masonry-list"
import { ArtworkGridItem } from "app/sharedUI/items/ArtworkGridItem"
import { useState } from "react"
import { GlobalStore } from "app/store/GlobalStore"
import { intersection } from "lodash"

type ArtworksToAddToAlbumRoute = RouteProp<HomeTabsScreens, "CreateAlbumPickArtworksOfArtist">

export const CreateAlbumPickArtworksOfArtist = () => {
  const { slug } = useRoute<ArtworksToAddToAlbumRoute>().params
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const artworksData = useLazyLoadQuery<ArtistArtworksQuery>(artistArtworksQuery, { slug })
  const artworks = extractNodes(artworksData.artist?.artworksConnection)
  const safeAreaInsets = useSafeAreaInsets()
  const selectedArtworks = GlobalStore.useAppState(
    (state) => state.albums.sessionState.selectedArtworks
  )

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

  const selectArtworksToAddToAnAlbum = async () => {
    await GlobalStore.actions.albums.selectArtworksForANewAlbum(selectedArtworkIds)
    navigation.navigate("CreateAlbum")
  }

  return (
    <Flex flex={1} pt={safeAreaInsets.top}>
      <Header
        label="Add to Album"
        rightElements={
          <Flex backgroundColor="black10" borderRadius={50} alignItems="center">
            <Touchable onPress={() => selectAllArtworkHandler(!areAllArtworkSelected)}>
              <Text px={2} py={0.5}>
                {selectedArtworkIds.length === artworks.length ? "Unselect All" : "Select All"}
              </Text>
            </Touchable>
          </Flex>
        }
      />
      <Spacer mt={2} />
      <MasonryList
        contentContainerStyle={{
          marginTop: 20,
          paddingRight: 20,
        }}
        numColumns={2}
        data={artworks}
        renderItem={({ item: artwork }) => (
          <ArtworkGridItem
            artwork={artwork}
            onPress={() => selectArtworkHandler(artwork.internalID)}
            selected={selectedArtworkIds.includes(artwork.internalID)}
          />
        )}
        keyExtractor={(item) => item.internalID!}
      />
      <Flex px={2} pt={1} pb={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 2}>
        <Text variant="xs" color="black60" mb={1} textAlign="center">
          Selected artworks for {artworksData.artist?.name}: {selectedArtworkIds.length}
        </Text>
        <Button
          block
          onPress={selectArtworksToAddToAnAlbum}
          disabled={selectedArtworkIds.length <= 0}
        >
          Add
        </Button>
      </Flex>
    </Flex>
  )
}
