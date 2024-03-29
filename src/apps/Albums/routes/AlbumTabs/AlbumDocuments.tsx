import { Tabs } from "@artsy/palette-mobile"
import { AlbumDocumentsQuery } from "__generated__/AlbumDocumentsQuery.graphql"
import { useAlbum } from "apps/Albums/hooks/useAlbum"
import { useValidateAlbumItems } from "apps/Albums/hooks/useValidateAlbumItems"
import { DocumentList } from "components/Lists/DocumentList"
import { graphql } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

interface AlbumDocumentsProps {
  albumId: string
}

export const AlbumDocuments: React.FC<AlbumDocumentsProps> = ({ albumId }) => {
  useTrackScreen({ name: "AlbumDocuments", type: "Album" })

  const partnerID = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )!
  const { documents } = useAlbum({ albumId })
  const documentIDs = documents.map((document) => document.internalID)

  useValidateAlbumItems<AlbumDocumentsQuery>({
    query: albumDocumentsQuery,
    variables: {
      documentIDs,
      partnerID,
    },
    idsToValidate: documentIDs,
    mapResponseToIDs: (data) => {
      return extractNodes(data?.partner?.documentsConnection).map(
        (document) => document.internalID
      )
    },
  })

  return (
    <Tabs.ScrollView>
      <DocumentList documents={documents} />
    </Tabs.ScrollView>
  )
}

export const albumDocumentsQuery = graphql`
  query AlbumDocumentsQuery($partnerID: String!, $documentIDs: [String]) {
    partner(id: $partnerID) {
      documentsConnection(first: 100, documentIDs: $documentIDs) {
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
