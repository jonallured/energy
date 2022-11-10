import { Button, Flex, useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistDocumentsQuery } from "__generated__/ArtistDocumentsQuery.graphql"
import { ListEmptyComponent, DocumentGridItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
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
  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isSelectModeActive)
  const selectedDocumentIds = GlobalStore.useAppState((state) => state.selectMode.items.documents)
  const [areAllDocumentSelected, setAreAllDocumentSelected] = useState<boolean>(
    selectedDocumentIds.length === documents.length
  )

  const selectDocumentHandler = (doc: string) => {
    GlobalStore.actions.selectMode.selectItems({ itemType: "documents", item: doc })
    setAreAllDocumentSelected(false)
  }

  const selectAllDocumentHandler = (toggleSelectAllDocument: boolean) => {
    if (toggleSelectAllDocument) {
      GlobalStore.actions.selectMode.selectAllItems({
        itemType: "documents",
        allItems: documents.map((doc) => doc.internalID),
      })
    } else {
      GlobalStore.actions.selectMode.selectAllItems({
        itemType: "documents",
        allItems: [],
      })
    }
    setAreAllDocumentSelected(toggleSelectAllDocument)
  }

  const cancelButtonHandler = () => {
    GlobalStore.actions.selectMode.cancelSelectMode()
  }

  return (
    <>
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
      {/* This should be moved to Headers */}
      {isSelectModeActive && (
        <Flex
          position="absolute"
          zIndex={3000}
          bottom={120}
          width="100%"
          justifyContent="space-between"
          flexDirection="row"
          px={2}
        >
          <Button
            variant="fillGray"
            size="small"
            onPress={() => selectAllDocumentHandler(!areAllDocumentSelected)}
          >
            {selectedDocumentIds.length === documents.length ? "Unselect All" : "Select All"}
          </Button>
          <Button variant="fillGray" size="small" onPress={cancelButtonHandler}>
            Cancel
          </Button>
        </Flex>
      )}
      {/* This should be moved to Headers */}
      <Flex position="absolute" zIndex={100} bottom={50} width="100%" alignItems="center">
        {!isSelectModeActive && (
          <Button onPress={() => GlobalStore.actions.selectMode.toggleSelectMode()}>Select</Button>
        )}
      </Flex>
    </>
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
