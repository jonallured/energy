import MasonryList from "@react-native-seoul/masonry-list"
import { ArtworkImageGridItem } from "components/Items/ArtworkImageGridItem"
import { ColumnItem } from "components/Items/ColumnItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { isSelected } from "components/SelectMode/SelectMode"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemInstall } from "system/store/Models/SelectModeModel"
import { useSelectedItems } from "utils/hooks/useSelectedItems"

interface ShowInstallationsProps {
  images: SelectedItemInstall[]
}

export const InstallationsList: React.FC<ShowInstallationsProps> = ({
  images = [],
}) => {
  const { selectedItems } = useSelectedItems()

  return (
    <MasonryList
      numColumns={2}
      data={images}
      renderItem={({ item, i }) => {
        const gridItem = item as SelectedItemInstall
        const width = gridItem.width as number
        const height = gridItem.height as number

        return (
          <ColumnItem index={i} numColumns={2} mb={2}>
            <ArtworkImageGridItem
              aspectRatio={width / height}
              url={gridItem?.url ?? ""}
              onPress={() =>
                GlobalStore.actions.selectMode.toggleSelectedItem(gridItem)
              }
              selectedToAdd={isSelected(selectedItems, gridItem)}
            />
          </ColumnItem>
        )
      }}
      ListEmptyComponent={
        <ListEmptyComponent text="No show install shots to display" />
      }
    />
  )
}
