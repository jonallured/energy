import { MasonryList } from "@react-native-seoul/masonry-list"
import { ColumnItem } from "app/components/Items/ColumnItem"
import { DocumentGridItem } from "app/components/Items/DocumentGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { isSelected } from "app/components/SelectMode"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItemDocument } from "app/system/store/Models/SelectModeModel"
import { getContentContainerStyle } from "app/utils/getContentContainerStyle"

interface DocumentListProps {
  documents: SelectedItemDocument[]
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const selectDocumentHandler = (doc: (typeof documents)[0]) => {
    GlobalStore.actions.selectMode.toggleSelectedItem(doc)
  }

  return (
    <MasonryList
      contentContainerStyle={{ ...getContentContainerStyle(), marginTop: 20 }}
      numColumns={2}
      data={documents}
      renderItem={({ item, i }) => {
        return (
          <ColumnItem index={i} numColumns={2}>
            <DocumentGridItem
              document={{
                url: item.publicURL,
                title: item.title,
                id: item.internalID,
                size: item.filesize,
              }}
              onPress={() => selectDocumentHandler(item)}
              selectedToAdd={isSelected(selectedItems, item)}
            />
          </ColumnItem>
        )
      }}
      keyExtractor={(item) => item.internalID}
      ListEmptyComponent={<ListEmptyComponent text="No documents" />}
    />
  )
}
