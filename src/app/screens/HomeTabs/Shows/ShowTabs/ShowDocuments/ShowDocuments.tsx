import { Flex, useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { isEqual } from "lodash"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowDocumentsQuery } from "__generated__/ShowDocumentsQuery.graphql"
import { ListEmptyComponent, DocumentGridItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { useHeaderSelectModeInTab } from "app/store/selectModeAtoms"
import { TabsScrollView } from "app/wrappers"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"
import { extractNodes } from "shared/utils"

export const ShowDocuments = ({ slug }: { slug: string }) => {
  const space = useSpace()
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)!
  const showDocumentsData = useLazyLoadQuery<ShowDocumentsQuery>(showDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })
  const documents = extractNodes(showDocumentsData.partner?.documentsConnection)

  const selectedDocumentIds = GlobalStore.useAppState((state) => state.selectMode.items.documents)
  useHeaderSelectModeInTab("ShowDocuments", {
    allSelected: isEqual(new Set(selectedDocumentIds), new Set(documents.map((d) => d.internalID))),
    selectAllFn: () =>
      void GlobalStore.actions.selectMode.selectAllItems({
        itemType: "documents",
        allItems: documents.map((d) => d.internalID),
      }),
    unselectAllFn: () =>
      void GlobalStore.actions.selectMode.selectAllItems({ itemType: "documents", allItems: [] }),
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
              GlobalStore.actions.selectMode.selectItem({
                itemType: "documents",
                item: document.internalID,
              })
            }
            selectedToAdd={selectedDocumentIds.includes(document.internalID)}
          />
        )}
        keyExtractor={(item) => item.internalID}
        ListEmptyComponent={
          <Flex mx={SCREEN_HORIZONTAL_PADDING}>
            <ListEmptyComponent text="No documents" />
          </Flex>
        }
      />
    </TabsScrollView>
  )
}

const showDocumentsQuery = graphql`
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
