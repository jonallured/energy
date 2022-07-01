import { Touchable } from "palette"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { extractNodes } from "shared/utils"
import { GlobalStore } from "app/store/GlobalStore"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { ArtistListItem } from "app/sharedUI"
import { TabsFlatList } from "app/wrappers"

export const Artists = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const artistsData = useLazyLoadQuery<ArtistsQuery>(artistsQuery, { partnerID })
  const artists = extractNodes(artistsData.partner?.allArtistsConnection)

  return (
    <TabsFlatList
      data={artists}
      renderItem={({ item: artist }) => (
        <Touchable
          onPress={() => {
            navigation.navigate("ArtistTabs", {
              slug: artist.slug,
            })
          }}
        >
          <ArtistListItem artist={artist} />
        </Touchable>
      )}
      keyExtractor={(item) => item?.internalID!}
    />
  )
}

const artistsQuery = graphql`
  query ArtistsQuery($partnerID: String!) {
    partner(id: $partnerID) {
      allArtistsConnection {
        totalCount
        edges {
          node {
            slug
            internalID
            ...ArtistListItem_artist
          }
        }
      }
    }
  }
`
