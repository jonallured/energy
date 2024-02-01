import { Button, EditIcon } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { EditArtworkInCmsQuery } from "__generated__/EditArtworkInCmsQuery.graphql"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"

export const EditArtworkInCms = ({ slug }: { slug: string }) => {
  const partnerID = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { data } = useSystemQueryLoader<EditArtworkInCmsQuery>(
    editArtworkInCmsQuery,
    { slug }
  )
  const internalID = data.artwork?.internalID as string

  return (
    <Button
      block
      onPress={() =>
        navigation.navigate("ArtworkWebView", {
          uri: `https://cms-staging.artsy.net/artworks/${internalID}/edit?partnerID=${partnerID}`,
          internalID,
          slug,
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
      slug
    }
  }
`
