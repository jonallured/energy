import MasonryList from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import {
  ArtworkGridItem,
  ArtworkGridItemFragmentContainer,
  ArtworkGridItemProps,
} from "components/Items/ArtworkGridItem"
import { ColumnItem } from "components/Items/ColumnItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { isSelected } from "components/SelectMode/SelectMode"
import { memo } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { isTablet } from "react-native-device-info"
import { GlobalStore } from "system/store/GlobalStore"
import {
  SelectedItem,
  SelectedItemArtwork,
} from "system/store/Models/SelectModeModel"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"

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
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  const numColumns = isTablet() ? 3 : 2

  return (
    <MasonryList
      testID="ArtworksList"
      contentContainerStyle={contentContainerStyle as object}
      numColumns={numColumns}
      data={presentedArtworks}
      renderItem={({ item, i }) => {
        return (
          <MemoizedArtworkListItem
            checkIfDisabled={checkIfDisabled}
            checkIfSelectedToRemove={checkIfSelectedToRemove}
            index={i}
            isStatic={isStatic}
            item={item as SelectedItemArtwork}
            key={i}
            numColumns={numColumns}
            presentedArtworks={presentedArtworks}
            onItemPress={onItemPress}
          />
        )
      }}
      keyExtractor={(item) => item.internalID}
      ListEmptyComponent={<ListEmptyComponent text="No artworks" />}
    />
  )
}

interface MemoizedArtworkListItemProps {
  checkIfDisabled?: (item: SelectedItemArtwork) => boolean
  checkIfSelectedToRemove?: (item: SelectedItemArtwork) => boolean
  index: number
  isStatic?: boolean
  item: SelectedItem
  numColumns: number
  onItemPress?: (item: SelectedItemArtwork) => void
  presentedArtworks: SelectedItemArtwork[]
}

const MemoizedArtworkListItem: React.FC<MemoizedArtworkListItemProps> = memo(
  ({
    checkIfDisabled,
    checkIfSelectedToRemove,
    index,
    isStatic,
    item,
    numColumns,
    onItemPress,
    presentedArtworks,
  }) => {
    const navigation = useNavigation<NavigationProp<NavigationScreens>>()

    const isSelectModeActive = GlobalStore.useAppState(
      (state) => state.selectMode.sessionState.isActive
    )
    const selectedItems = GlobalStore.useAppState(
      (state) => state.selectMode.sessionState.selectedItems
    )

    const artworkSlugs = presentedArtworks.map((artwork) => artwork.slug)

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

    const gridItem = item as SelectedItemArtwork
    const isDisabled = checkIfDisabled ? checkIfDisabled(gridItem) : false

    // When static, we're not apart of relay query / fragment lifecycle and
    // render out out a static list of items
    const GridItem = isStatic
      ? ArtworkGridItem
      : ArtworkGridItemFragmentContainer

    // Typically used in create / edit album mode. If already added to an album
    // return null so the user can't select it. A bit more clear than just
    // disabling the item.
    if (isDisabled) {
      return null
    }

    return (
      <ColumnItem index={index} numColumns={numColumns}>
        <GridItem
          artwork={gridItem}
          disable={isDisabled}
          onPress={() => handleArtworkItemPress(gridItem)}
          selectedToAdd={isSelected(selectedItems, gridItem)}
          selectedToRemove={
            checkIfSelectedToRemove ? checkIfSelectedToRemove(gridItem) : false
          }
        />
      </ColumnItem>
    )
  }
)
