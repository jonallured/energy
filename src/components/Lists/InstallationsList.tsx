import { MasonryList } from "@react-native-seoul/masonry-list"
import { ArtworkImageGridItem } from "components/Items/ArtworkImageGridItem"
import { ColumnItem } from "components/Items/ColumnItem"
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
      contentContainerStyle={getContentContainerStyle()}
      numColumns={2}
      data={images}
      renderItem={({ item, i }) => (
        <ColumnItem index={i} numColumns={2} mt={2}>
          <ArtworkImageGridItem
            url={item?.url ?? ""}
            onPress={() => GlobalStore.actions.selectMode.toggleSelectedItem(item)}
            selectedToAdd={isSelected(selectedItems, item)}
          />
        </ColumnItem>
      )}
      ListEmptyComponent={<ListEmptyComponent text="No show install shots to display" />}
    />
  )
}
