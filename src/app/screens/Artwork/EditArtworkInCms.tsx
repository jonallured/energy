import { Button, EditIcon } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { EditArtworkInCmsQuery } from "__generated__/EditArtworkInCmsQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { graphql } from "react-relay"

export const EditArtworkInCms = ({ slug }: { slug: string }) => {
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const artworkData = useSystemQueryLoader<EditArtworkInCmsQuery>(editArtworkInCmsQuery, { slug })
  const internalID = artworkData.artwork?.internalID

  return (
    <Button
      block
      onPress={() =>
        navigation.navigate("ArtworkWebView", {
          uri: `https://cms-staging.artsy.net/artworks/${internalID}/edit?partnerID=${partnerID}`,
        })
      }
      icon={<EditIcon fill="white100" />}
      iconPosition="right"
    >
      Edit artwork in CMS
    </Button>
  )
}

const editArtworkInCmsQuery = graphql`
  query EditArtworkInCmsQuery($slug: String!) {
    artwork(id: $slug) {
      internalID
    }
  }
`
