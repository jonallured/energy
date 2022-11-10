import { Flex, useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { isEqual } from "lodash"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistDocumentsQuery } from "__generated__/ArtistDocumentsQuery.graphql"
import { ListEmptyComponent, DocumentGridItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { useHeaderSelectModeInTab } from "app/store/selectModeAtoms"
import { TabsScrollView } from "app/wrappers"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"
import { extractNodes } from "shared/utils"

export const ArtistDocuments = ({ slug }: { slug: string }) => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artistDocumentsData = useLazyLoadQuery<ArtistDocumentsQuery>(artistDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })

  const documents = extractNodes(artistDocumentsData.partner?.documentsConnection)
  const space = useSpace()
  const selectedDocumentIds = GlobalStore.useAppState((state) => state.selectMode.items.documents)

  useHeaderSelectModeInTab("ArtistDocuments", {
    allSelected: isEqual(new Set(selectedDocumentIds), new Set(documents.map((d) => d.internalID))),
    selectAllFn: () =>
      void GlobalStore.actions.selectMode.selectAllItems({
        itemType: "documents",
        allItems: documents.map((doc) => doc.internalID),
      }),
    unselectAllFn: () =>
      void GlobalStore.actions.selectMode.selectAllItems({
        itemType: "documents",
        allItems: [],
      }),
  })

  const selectDocumentHandler = (doc: string) => {
    GlobalStore.actions.selectMode.selectItem({ itemType: "documents", item: doc })
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
        ListEmptyComponent={
          <Flex ml={SCREEN_HORIZONTAL_PADDING}>
            <ListEmptyComponent text="No documents" />
          </Flex>
        }
      />
    </TabsScrollView>
  )
}

const artistDocumentsQuery = graphql`
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
