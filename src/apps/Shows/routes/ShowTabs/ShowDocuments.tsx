import { Tabs } from "@artsy/palette-mobile"
import { ShowDocumentsQuery } from "__generated__/ShowDocumentsQuery.graphql"
import { DocumentList } from "components/Lists/DocumentList"
import { graphql } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"
import { useSetSelectModeActiveTab } from "utils/hooks/useSetSelectModeActiveTab"

interface ShowDocumentsProps {
  slug: string
}

export const ShowDocuments: React.FC<ShowDocumentsProps> = ({ slug }) => {
  useTrackScreen({ name: "ShowDocuments", type: "Show", slug })

  const activePartnerID = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )!
  const { data, refreshControl } = useSystemQueryLoader<ShowDocumentsQuery>(
    showDocumentsQuery,
    {
      slug,
      partnerID: activePartnerID,
    }
  )

  const documents = extractNodes(data.partner?.documentsConnection)

  useSetSelectModeActiveTab({
    name: "ShowDocuments",
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

export const showDocumentsQuery = graphql`
  query ShowDocumentsQuery($slug: String!, $partnerID: String!) {
    partner(id: $partnerID) {
      documentsConnection(first: 100, showID: $slug) {
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
