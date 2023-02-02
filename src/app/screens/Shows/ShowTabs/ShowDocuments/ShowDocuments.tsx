import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { isEqual } from "lodash"
import { graphql } from "react-relay"
import { ShowDocumentsQuery } from "__generated__/ShowDocumentsQuery.graphql"
import { DocumentGridItem } from "app/components/Items/DocumentGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { useHeaderSelectModeInTab } from "app/system/store/selectModeAtoms"
import { extractNodes } from "app/utils/extractNodes"

export const ShowDocuments = ({ slug }: { slug: string }) => {
  const space = useSpace()
  const selectedPartner = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const showDocumentsData = useSystemQueryLoader<ShowDocumentsQuery>(showDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })
  const documents = extractNodes(showDocumentsData.partner?.documentsConnection)

  const selectedDocumentIds = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.documents
  )
  useHeaderSelectModeInTab("ShowDocuments", {
    allSelected: isEqual(new Set(selectedDocumentIds), new Set(documents.map((d) => d.internalID))),
    selectAllFn: () =>
      void GlobalStore.actions.selectMode.setSelectedItems({
        type: "document",
        items: documents.map((d) => d.internalID),
      }),
    unselectAllFn: () =>
      void GlobalStore.actions.selectMode.setSelectedItems({ type: "document", items: [] }),
  })

  return (
    <TabsScrollView>
      <MasonryList
        contentContainerStyle={{
          marginTop: documents.length ? space("2") : 0,
          paddingRight: space("2"),
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
            onPress={() =>
              GlobalStore.actions.selectMode.toggleSelectedItem({
                type: "document",
                item: document.internalID,
              })
            }
            selectedToAdd={selectedDocumentIds.includes(document.internalID)}
          />
        )}
        keyExtractor={(item) => item.internalID}
        ListEmptyComponent={<ListEmptyComponent text="No documents" />}
      />
    </TabsScrollView>
  )
}

export const showDocumentsQuery = graphql`
  query ShowDocumentsQuery($slug: String!, $partnerID: String!) {
    partner(id: $partnerID) {
      documentsConnection(first: 100, showID: $slug) {
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
