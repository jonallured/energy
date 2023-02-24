import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { isEqual } from "lodash"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { graphql } from "react-relay"
import { ArtistDocumentsQuery } from "__generated__/ArtistDocumentsQuery.graphql"
import { DocumentGridItem } from "app/components/Items/DocumentGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { Portal } from "app/components/Portal"
import { SelectMode } from "app/components/SelectMode"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"

export const ArtistDocuments = ({ slug }: { slug: string }) => {
  const selectedPartner = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const artistDocumentsData = useSystemQueryLoader<ArtistDocumentsQuery>(artistDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })

  const documents = extractNodes(artistDocumentsData.partner?.documentsConnection)
  const space = useSpace()
  const selectedDocumentIds = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.documents
  )

  const selectDocumentHandler = (doc: string) => {
    GlobalStore.actions.selectMode.toggleSelectedItem({ type: "document", item: doc })
  }

  const activeTab = useFocusedTab()

  const allSelected = isEqual(
    new Set(selectedDocumentIds),
    new Set(documents.map((d) => d.internalID))
  )

  return (
    <>
      <Portal active={activeTab === "ArtistDocuments"}>
        <SelectMode
          allSelected={allSelected}
          selectAll={() => {
            GlobalStore.actions.selectMode.setSelectedItems({
              type: "document",
              items: documents.map((doc) => doc.internalID),
            })
          }}
          unselectAll={() => {
            GlobalStore.actions.selectMode.setSelectedItems({
              type: "document",
              items: [],
            })
          }}
        />
      </Portal>
      <TabsScrollView>
        <MasonryList
          contentContainerStyle={{
            marginTop: space(2),
            paddingHorizontal: space(2),
          }}
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
              onPress={() => selectDocumentHandler(document.internalID)}
              selectedToAdd={selectedDocumentIds.includes(document.internalID)}
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
