import { MasonryList } from "@react-native-seoul/masonry-list"
import { ArtistDocumentsQuery } from "__generated__/ArtistDocumentsQuery.graphql"
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

export const ArtistDocuments = ({ slug }: { slug: string }) => {
  const selectedPartner = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const artistDocumentsData = useSystemQueryLoader<ArtistDocumentsQuery>(artistDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })

  const documents = extractNodes(artistDocumentsData.partner?.documentsConnection)
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const selectDocumentHandler = (doc: (typeof documents)[0]) => {
    GlobalStore.actions.selectMode.toggleSelectedItem(doc)
  }

  const activeTab = useFocusedTab()
  const allSelected = isAllSelected(selectedItems, documents)

  return (
    <>
      <Portal active={activeTab === "ArtistDocuments"}>
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
              onPress={() => selectDocumentHandler(document)}
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

export const artistDocumentsQuery = graphql`
  query ArtistDocumentsQuery($slug: String!, $partnerID: String!) {
    partner(id: $partnerID) {
      documentsConnection(first: 100, artistID: $slug) {
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
