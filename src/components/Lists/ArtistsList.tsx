import { Tabs } from "@artsy/palette-mobile"
import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistsListQuery } from "__generated__/ArtistsListQuery.graphql"
import { ArtistListItem } from "components/Items/ArtistListItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { zip } from "lodash"
import { StyleProp, ViewStyle } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { graphql } from "relay-runtime"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

interface ArtistsListProps {
  contentContainerStyle?: StyleProp<ViewStyle>
  onItemPress: (item: ArtistListItem_artist$data) => void
  isInTabs?: boolean
}

export const ArtistsList: React.FC<ArtistsListProps> = ({
  contentContainerStyle,
  onItemPress,
  isInTabs,
}) => {
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const { data, refreshControl } = useSystemQueryLoader<ArtistsListQuery>(artistsListQuery, {
    partnerID,
  })
  const artists = extractNodes(data.partner?.allArtistsConnection)
  const counts = data.partner?.allArtistsConnection?.edges?.map(
    (edge) => edge?.counts?.managedArtworks as string
  )

  if (!counts || !artists) {
    return null
  }

  const items = zip(artists, counts)

  const ArtistsFlatList = isInTabs ? Tabs.FlatList : FlatList

  return (
    <ArtistsFlatList
      data={items}
      numColumns={1}
      initialNumToRender={30}
      contentContainerStyle={isInTabs ? { paddingHorizontal: 20 } : contentContainerStyle}
      renderItem={({ item }) => {
        const artist = item[0]
        const count = item[1]

        if (!artist || !count) {
          return null
        }

        return (
          <ArtistListItem artist={artist} count={count} onPress={(item) => onItemPress(item)} />
        )
      }}
      keyExtractor={(item) => item[0]?.internalID as string}
      ListEmptyComponent={<ListEmptyComponent text="No artists" />}
      refreshControl={refreshControl}
    />
  )
}

export const artistsListQuery = graphql`
  query ArtistsListQuery($partnerID: String!) {
    partner(id: $partnerID) {
      allArtistsConnection(includeAllFields: true) {
        totalCount
        edges {
          counts {
            managedArtworks
          }
          node {
            name
            slug
            internalID
            ...ArtistListItem_artist
          }
        }
      }
    }
  }
`
