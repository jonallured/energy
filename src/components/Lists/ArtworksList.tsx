import { Tabs } from "@artsy/palette-mobile"
import { MasonryFlashList } from "@shopify/flash-list"
import {
  ArtworkGridItem,
  ArtworkGridItemFragmentContainer,
  ArtworkGridItemProps,
} from "components/Items/ArtworkGridItem"
import { ColumnItem } from "components/Items/ColumnItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { MasonryListFooterComponent } from "components/MasonryListFooterComponent"
import { isSelected } from "components/SelectMode/SelectMode"
import { memo, useCallback } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { isTablet } from "react-native-device-info"
import { useRouter } from "system/hooks/useRouter"
import { GlobalStore } from "system/store/GlobalStore"
import {
  SelectedItem,
  SelectedItemArtwork,
} from "system/store/Models/SelectModeModel"
import {
  MASONRY_ESTIMATED_ITEM_SIZE,
  MASONRY_ON_END_REACHED_THRESHOLD,
  LIST_PAGE_SIZE,
} from "utils/constants"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"

interface ArtworksListProps {
  artworks: SelectedItemArtwork[]
  checkIfDisabled?: (item: SelectedItemArtwork) => boolean
  checkIfSelectedToRemove?: (item: SelectedItemArtwork) => boolean
  contentContainerStyle?: StyleProp<ViewStyle>
  gridItemProps?: ArtworkGridItemProps
  hasNext?: boolean
  isInTabs?: boolean
  isLoadingNext?: boolean
  isStatic?: boolean
  loadMore?: (pageSize: number) => void
  onItemPress?: (item: SelectedItemArtwork) => void
  pageSize?: number
  refreshControl?: JSX.Element
}

export const ArtworksList: React.FC<ArtworksListProps> = ({
  artworks,
  checkIfDisabled,
  checkIfSelectedToRemove,
  contentContainerStyle = { paddingHorizontal: 20 },
  hasNext,
  isInTabs = false,
  isLoadingNext,
  isStatic = true,
  loadMore,
  onItemPress,
  pageSize = LIST_PAGE_SIZE,
  refreshControl,
}) => {
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  const numColumns = isTablet() ? 3 : 2

  const shouldDisplaySpinner = !!artworks.length && !!isLoadingNext && !!hasNext

  const onEndReached = useCallback(() => {
    if (!!hasNext && !isLoadingNext && !!loadMore) {
      loadMore?.(pageSize)
    }
  }, [hasNext, isLoadingNext])

  const MasonryList = isInTabs ? Tabs.Masonry : MasonryFlashList

  return (
    <MasonryList
      testID="ArtworksList"
      numColumns={numColumns}
      contentContainerStyle={contentContainerStyle as any}
      data={presentedArtworks}
      renderItem={({ item, index }) => {
        return (
          <MemoizedArtworkListItem
            checkIfDisabled={checkIfDisabled}
            checkIfSelectedToRemove={checkIfSelectedToRemove}
            index={index}
            isStatic={isStatic}
            item={item as SelectedItemArtwork}
            key={index}
            numColumns={numColumns}
            presentedArtworks={presentedArtworks}
            onItemPress={onItemPress}
          />
        )
      }}
      keyExtractor={(item) => item.internalID}
      onEndReached={onEndReached}
      onEndReachedThreshold={MASONRY_ON_END_REACHED_THRESHOLD}
      estimatedItemSize={MASONRY_ESTIMATED_ITEM_SIZE}
      refreshControl={refreshControl}
      ListEmptyComponent={<ListEmptyComponent text="No artworks" />}
      ListFooterComponent={
        <MasonryListFooterComponent
          shouldDisplaySpinner={shouldDisplaySpinner}
        />
      }
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
    const { router } = useRouter()

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
          router.navigate("Artwork", {
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
