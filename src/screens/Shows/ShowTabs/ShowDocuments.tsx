import { ShowDocumentsQuery } from "__generated__/ShowDocumentsQuery.graphql"
import { DocumentList } from "components/Lists/DocumentList"
import { SelectModePortal } from "components/SelectModePortal"
import { TabsScrollView } from "components/Tabs/TabsContent"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

interface ShowDocumentsProps {
  slug: string
}

export const ShowDocuments: React.FC<ShowDocumentsProps> = ({ slug }) => {
  const activePartnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const showDocumentsData = useSystemQueryLoader<ShowDocumentsQuery>(showDocumentsQuery, {
    slug,
    partnerID: activePartnerID,
  })

  const documents = extractNodes(showDocumentsData.partner?.documentsConnection)

  return (
    <>
      <SelectModePortal tabName="ShowDocuments" items={documents} />

      <TabsScrollView>
        <DocumentList documents={documents} />
      </TabsScrollView>
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
