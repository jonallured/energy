import { Tabs } from "@artsy/palette-mobile"
import { ArtistDocumentsQuery } from "__generated__/ArtistDocumentsQuery.graphql"
import { DocumentList } from "components/Lists/DocumentList"
import { graphql } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"
import { useSetSelectModeActiveTab } from "utils/hooks/useSetSelectModeActiveTab"

interface ArtistDocumentsProps {
  slug: string
}

export const ArtistDocuments: React.FC<ArtistDocumentsProps> = ({ slug }) => {
  useTrackScreen({ name: "ArtistDocuments", type: "Artist", slug })

  const selectedPartner = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )!
  const { data, refreshControl } = useSystemQueryLoader<ArtistDocumentsQuery>(
    artistDocumentsQuery,
    {
      slug,
      partnerID: selectedPartner,
    }
  )

  const documents = extractNodes(data.partner?.documentsConnection)

  useSetSelectModeActiveTab({
    name: "ArtistDocuments",
    items: documents,
  })

  return (
    <>
      <Tabs.ScrollView refreshControl={refreshControl}>
        <DocumentList documents={documents} />
      </Tabs.ScrollView>
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
