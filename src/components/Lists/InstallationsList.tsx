import { MasonryList } from "@react-native-seoul/masonry-list"
import { ArtworkImageGridItem } from "components/Items/ArtworkImageGridItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { isSelected } from "components/SelectMode"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemInstall } from "system/store/Models/SelectModeModel"
import { getContentContainerStyle } from "utils/getContentContainerStyle"

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
