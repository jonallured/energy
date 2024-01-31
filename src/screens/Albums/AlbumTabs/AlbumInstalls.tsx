import { Tabs } from "@artsy/palette-mobile"
import { AlbumInstallsQuery } from "__generated__/AlbumInstallsQuery.graphql"
import { InstallationsList } from "components/Lists/InstallationsList"
import { graphql } from "relay-runtime"
import { useAlbum } from "screens/Albums/useAlbum"
import { useValidateAlbumItems } from "screens/Albums/useValidateAlbumItems"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

interface AlbumInstallsProps {
  albumId: string
}

export const AlbumInstalls: React.FC<AlbumInstallsProps> = ({ albumId }) => {
  useTrackScreen({ name: "AlbumInstalls", type: "Album" })

  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID as string)
  const { installs } = useAlbum({ albumId })
  const installIDs = installs?.map((install) => install.internalID as string)

  useValidateAlbumItems<AlbumInstallsQuery>({
    query: albumInstallsQuery,
    variables: {
      partnerID,
    },
    idsToValidate: installIDs,
    mapResponseToIDs: (data) => {
      return extractNodes(data.partner?.showsConnection).flatMap(
        (show) => show.images?.map((image) => image?.internalID as string) as string[]
      )
    },
  })

  return (
    <Tabs.ScrollView>
      <InstallationsList images={installs} />
    </Tabs.ScrollView>
  )
}

const albumInstallsQuery = graphql`
  query AlbumInstallsQuery($partnerID: String!) {
    partner(id: $partnerID) {
      showsConnection(first: 100, status: ALL) {
        edges {
          node {
            images(default: true) {
              internalID
            }
          }
        }
      }
    }
  }
`
