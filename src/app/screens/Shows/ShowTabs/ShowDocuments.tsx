import { ShowDocumentsQuery } from "__generated__/ShowDocumentsQuery.graphql"
import { DocumentList } from "app/components/Lists/DocumentList"
import { SelectModePortal } from "app/components/SelectModePortal"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { graphql } from "react-relay"

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
