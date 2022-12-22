import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { isEqual } from "lodash"
import { graphql } from "react-relay"
import { ArtistDocumentsQuery } from "__generated__/ArtistDocumentsQuery.graphql"
import { DocumentGridItem } from "app/components/Items/DocumentGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { useHeaderSelectModeInTab } from "app/system/store/selectModeAtoms"
import { extractNodes } from "app/utils"

export const ArtistDocuments = ({ slug }: { slug: string }) => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artistDocumentsData = useSystemQueryLoader<ArtistDocumentsQuery>(artistDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })

  const documents = extractNodes(artistDocumentsData.partner?.documentsConnection)
  const space = useSpace()
  const selectedDocumentIds = GlobalStore.useAppState((state) => state.selectMode.documents)

  useHeaderSelectModeInTab("ArtistDocuments", {
    allSelected: isEqual(new Set(selectedDocumentIds), new Set(documents.map((d) => d.internalID))),
    selectAllFn: () =>
      void GlobalStore.actions.selectMode.setSelectedItems({
        type: "document",
        items: documents.map((doc) => doc.internalID),
      }),
    unselectAllFn: () =>
      void GlobalStore.actions.selectMode.setSelectedItems({
        type: "document",
        items: [],
      }),
  })

  const selectDocumentHandler = (doc: string) => {
    GlobalStore.actions.selectMode.toggleSelectedItem({ type: "document", item: doc })
  }

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
            onPress={() => selectDocumentHandler(document.internalID)}
            selectedToAdd={selectedDocumentIds.includes(document.internalID)}
          />
        )}
        keyExtractor={(item) => item.internalID}
        ListEmptyComponent={<ListEmptyComponent text="No documents" />}
      />
    </TabsScrollView>
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
