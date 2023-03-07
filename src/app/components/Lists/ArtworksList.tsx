import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "app/Navigation"
import {
  ArtworkGridItem,
  ArtworkGridItemFragmentContainer,
  ArtworkGridItemProps,
} from "app/components/Items/ArtworkGridItem"
import { ColumnItem } from "app/components/Items/ColumnItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { isSelected } from "app/components/SelectMode"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItemArtwork } from "app/system/store/Models/SelectModeModel"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"
import { StyleProp, ViewStyle } from "react-native"
import { isTablet } from "react-native-device-info"

interface ArtworksListProps {
  artworks: SelectedItemArtwork[]
  checkIfDisabled?: (item: SelectedItemArtwork) => boolean
  checkIfSelectedToRemove?: (item: SelectedItemArtwork) => boolean
  contentContainerStyle?: StyleProp<ViewStyle>
  isStatic?: boolean
  onItemPress?: (item: SelectedItemArtwork) => void
  gridItemProps?: ArtworkGridItemProps
}

export const ArtworksList: React.FC<ArtworksListProps> = ({
  artworks,
  checkIfDisabled,
  checkIfSelectedToRemove,
  contentContainerStyle = {},
  isStatic = true,
  onItemPress,
}) => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()

  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const presentedArtworks = usePresentationFilteredArtworks(artworks)
  const artworkSlugs = presentedArtworks.map((artwork) => artwork.slug)

  const space = useSpace()
  const numColumns = isTablet() ? 3 : 2

  const handleArtworkItemPress = (item: SelectedItemArtwork) => {
    if (onItemPress) {
      onItemPress(item)
    } else {
      // Default list mode funcitonality
      if (isSelectModeActive) {
        GlobalStore.actions.selectMode.toggleSelectedItem(item)
      } else {
        navigation.navigate("Artwork", {
          slug: item.slug,
          contextArtworkSlugs: artworkSlugs,
        })
      }
    }
  }

  return (
    <MasonryList
      testID="ArtworksList"
      contentContainerStyle={{
        marginTop: space(2),
        paddingHorizontal: space(2),
        ...(contentContainerStyle as object),
      }}
      numColumns={numColumns}
      data={presentedArtworks}
      renderItem={({ item, i }) => {
        const isDisabled = checkIfDisabled ? checkIfDisabled(item) : false

        // When static, we're not apart of relay query / fragment lifecycle and
        // render out out a static list of items
        const GridItem = isStatic ? ArtworkGridItem : ArtworkGridItemFragmentContainer

        return (
          <ColumnItem index={i} numColumns={numColumns}>
            <GridItem
              artwork={item}
              disable={isDisabled}
              onPress={() => handleArtworkItemPress(item)}
              selectedToAdd={isSelected(selectedItems, item)}
              selectedToRemove={checkIfSelectedToRemove ? checkIfSelectedToRemove(item) : false}
            />
          </ColumnItem>
        )
      }}
      keyExtractor={(item) => item.internalID}
      ListEmptyComponent={<ListEmptyComponent text="No artworks" />}
    />
  )
}
