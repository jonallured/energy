import { ArtistDocumentsQuery } from "__generated__/ArtistDocumentsQuery.graphql"
import { DocumentList } from "components/Lists/DocumentList"
import { SelectModePortal } from "components/SelectModePortal"
import { TabsScrollView } from "components/Tabs/TabsContent"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

interface ArtistDocumentsProps {
  slug: string
}

export const ArtistDocuments: React.FC<ArtistDocumentsProps> = ({ slug }) => {
  const selectedPartner = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const artistDocumentsData = useSystemQueryLoader<ArtistDocumentsQuery>(artistDocumentsQuery, {
    slug,
    partnerID: selectedPartner,
  })

  const documents = extractNodes(artistDocumentsData.partner?.documentsConnection)

  return (
    <>
      <SelectModePortal tabName="ArtistDocuments" items={documents} />

      <TabsScrollView>
        <DocumentList documents={documents} />
      </TabsScrollView>
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
