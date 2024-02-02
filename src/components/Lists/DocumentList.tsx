import MasonryList from "@react-native-seoul/masonry-list"
import { ColumnItem } from "components/Items/ColumnItem"
import { DocumentGridItem } from "components/Items/DocumentGridItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { isSelected } from "components/SelectMode/SelectMode"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemDocument } from "system/store/Models/SelectModeModel"

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
      numColumns={2}
      data={documents}
      renderItem={({ item, i }) => {
        const documentItem = item as SelectedItemDocument

        return (
          <ColumnItem index={i} numColumns={2}>
            <DocumentGridItem
              document={{
                url: documentItem.publicURL,
                title: documentItem.title,
                id: documentItem.internalID,
                size: documentItem.filesize,
              }}
              onPress={() => selectDocumentHandler(documentItem)}
              selectedToAdd={isSelected(selectedItems, documentItem)}
            />
          </ColumnItem>
        )
      }}
      keyExtractor={(item) => item.internalID}
      ListEmptyComponent={<ListEmptyComponent text="No documents" />}
    />
  )
}
