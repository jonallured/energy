import { ArtistDocumentsQuery } from "__generated__/ArtistDocumentsQuery.graphql"
import { DocumentList } from "app/components/Lists/DocumentList"
import { SelectModePortal } from "app/components/SelectModePortal"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { graphql } from "react-relay"

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
