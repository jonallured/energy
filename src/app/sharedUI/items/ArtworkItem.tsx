import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtworkGridItem } from "./ArtworkGridItem"
import { ArtworkItemQuery } from "__generated__/ArtworkItemQuery.graphql"

interface ArtworkItemProps {
  artworkId: string
  onPress?: () => void
  selectedToRemove?: boolean
}

export const ArtworkItem = ({ artworkId, onPress, selectedToRemove }: ArtworkItemProps) => {
  const artworkData = useLazyLoadQuery<ArtworkItemQuery>(artworkItemQuery, { id: artworkId })
  return (
    <ArtworkGridItem
      artwork={artworkData.artwork!}
      onPress={onPress}
      selectedToRemove={selectedToRemove}
    />
  )
}

const artworkItemQuery = graphql`
  query ArtworkItemQuery($id: String!) {
    artwork(id: $id) {
      ...ArtworkGridItem_artwork
    }
  }
`
