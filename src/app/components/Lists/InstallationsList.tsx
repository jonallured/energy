import { MasonryList } from "@react-native-seoul/masonry-list"
import { ArtworkImageGridItem } from "app/components/Items/ArtworkImageGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { isSelected } from "app/components/SelectMode"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItemInstall } from "app/system/store/Models/SelectModeModel"
import { getContentContainerStyle } from "app/utils/getContentContainerStyle"

interface ShowInstallationsProps {
  images: SelectedItemInstall[]
}

export const InstallationsList: React.FC<ShowInstallationsProps> = ({ images = [] }) => {
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  return (
    <MasonryList
      contentContainerStyle={getContentContainerStyle(images)}
      numColumns={2}
      data={images}
      keyExtractor={(item, index) => item?.internalID ?? `${index}`}
      renderItem={({ item }) => (
        <ArtworkImageGridItem
          url={item?.url ?? ""}
          onPress={() => GlobalStore.actions.selectMode.toggleSelectedItem(item)}
          selectedToAdd={isSelected(selectedItems, item)}
        />
      )}
      ListEmptyComponent={<ListEmptyComponent text="No show install shots to display" />}
    />
  )
}
