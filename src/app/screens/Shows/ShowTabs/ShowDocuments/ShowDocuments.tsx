import { MasonryList } from "@react-native-seoul/masonry-list"
import { ShowDocumentsQuery } from "__generated__/ShowDocumentsQuery.graphql"
import { DocumentGridItem } from "app/components/Items/DocumentGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { Portal } from "app/components/Portal"
import { isAllSelected, isSelected, SelectMode } from "app/components/SelectMode"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { getContentContainerStyle } from "app/utils/getContentContainerStyle"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { graphql } from "react-relay"

export const ShowDocuments = ({ slug }: { slug: string }) => {
  const selectedPartner = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const showDocumentsData = useSystemQueryLoader<ShowDocumentsQuery>(showDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })
  const documents = extractNodes(showDocumentsData.partner?.documentsConnection)

  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const activeTab = useFocusedTab()
  const allSelected = isAllSelected(selectedItems, documents)

  return (
    <>
      <Portal active={activeTab === "ShowDocuments"}>
        <SelectMode
          allSelected={allSelected}
          selectAll={() => {
            GlobalStore.actions.selectMode.selectItems(documents)
          }}
          unselectAll={() => {
            GlobalStore.actions.selectMode.clearSelectedItems()
          }}
        />
      </Portal>
      <TabsScrollView>
        <MasonryList
          contentContainerStyle={getContentContainerStyle(documents)}
          numColumns={2}
          data={documents}
          renderItem={({ item: document }) => (
            <DocumentGridItem
              document={{
                url: document.publicURL,
                title: document.title,
                id: document.internalID,
                size: document.filesize,
              }}
              onPress={() => GlobalStore.actions.selectMode.toggleSelectedItem(document)}
              selectedToAdd={isSelected(selectedItems, document)}
            />
          )}
          keyExtractor={(item) => item.internalID}
          ListEmptyComponent={<ListEmptyComponent text="No documents" />}
        />
      </TabsScrollView>
    </>
  )
}

export const showDocumentsQuery = graphql`
  query ShowDocumentsQuery($slug: String!, $partnerID: String!) {
    partner(id: $partnerID) {
      documentsConnection(first: 100, showID: $slug) {
        edges {
          node {
            __typename
            internalID
            title
            filesize
            publicURL
          }
        }
      }
    }
  }
`
