import { useSpace } from "@artsy/palette-mobile"
import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistsListQuery } from "__generated__/ArtistsListQuery.graphql"
import { ArtistListItem } from "app/components/Items/ArtistListItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { getContentContainerStyle } from "app/utils/getContentContainerStyle"
import { zip } from "lodash"
import { StyleProp, ViewStyle } from "react-native"
import { isTablet } from "react-native-device-info"
import { FlatList } from "react-native-gesture-handler"
import { graphql } from "relay-runtime"

interface ArtistsListProps {
  contentContainerStyle?: StyleProp<ViewStyle>
  onItemPress: (item: ArtistListItem_artist$data) => void
}

export const ArtistsList: React.FC<ArtistsListProps> = ({ contentContainerStyle, onItemPress }) => {
  const space = useSpace()
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const data = useSystemQueryLoader<ArtistsListQuery>(artistsListQuery, { partnerID })
  const artists = extractNodes(data.partner?.allArtistsConnection)
  const counts = data.partner?.allArtistsConnection?.edges?.map(
    (edge) => edge?.counts?.managedArtworks as string
  )
  const numColumns = isTablet() ? 2 : 1

  if (!counts || !artists) {
    return null
  }

  const items = zip(artists, counts)

  return (
    <FlatList
      data={items}
      numColumns={numColumns}
      contentContainerStyle={
        contentContainerStyle ?? {
          ...getContentContainerStyle(),
          paddingTop: space(6),
          paddingBottom: space(2),
        }
      }
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
