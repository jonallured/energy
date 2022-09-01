import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Button, EditIcon } from "palette"
import { GlobalStore } from "app/store/GlobalStore"
import { graphql, useLazyLoadQuery } from "react-relay"
import { EditArtworkInCmsQuery } from '__generated__/EditArtworkInCmsQuery.graphql'

export const EditArtworkInCms = ({ slug }: { slug: string }) => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const artworkData = useLazyLoadQuery<EditArtworkInCmsQuery>(editArtworkInCmsQuery, { slug })
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
