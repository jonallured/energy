import { MasonryList } from "@react-native-seoul/masonry-list"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistDocumentsQuery } from "__generated__/ArtistDocumentsQuery.graphql"
import { ListEmptyComponent, DocumentGridItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { TabsScrollView } from "app/wrappers"
import { Button, Flex, useSpace } from "palette"
import { extractNodes } from "shared/utils"

export const ArtistDocuments = ({ slug }: { slug: string }) => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artistDocumentsData = useLazyLoadQuery<ArtistDocumentsQuery>(artistDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })
  const documents = extractNodes(artistDocumentsData.partnerArtistDocumentsConnection)
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
        allItems: documents.map((doc) => doc.id),
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
                url: document.publicUrl,
                title: document.title,
                id: document.id,
                size: document.size,
              }}
              onPress={() => selectDocumentHandler(document.id)}
              selectedToAdd={selectedDocumentIds.includes(document.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<ListEmptyComponent text="No documents" />}
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
    partnerArtistDocumentsConnection(artistID: $slug, partnerID: $partnerID, first: 100) {
      edges {
        node {
          id
          title
          size
          publicUrl
        }
      }
    }
  }
`
