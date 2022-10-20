import { ViewProps } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtworkItemQuery } from "__generated__/ArtworkItemQuery.graphql"
import { ArtworkGridItem } from "app/sharedUI"
import { imageSize } from "app/utils/imageSize"

interface ArtworkItemProps {
  artworkId: string
  onPress?: () => void
  selectedToRemove?: boolean
  style?: ViewProps["style"]
}

export const ArtworkItem = ({ artworkId, onPress, selectedToRemove, style }: ArtworkItemProps) => {
  const artworkData = useLazyLoadQuery<ArtworkItemQuery>(artworkItemQuery, {
    id: artworkId,
    imageSize,
  })
  return (
    <ArtworkGridItem
      artwork={artworkData.artwork!}
      onPress={onPress}
      selectedToRemove={selectedToRemove}
      style={style}
    />
  )
}

const artworkItemQuery = graphql`
  query ArtworkItemQuery($id: String!, $imageSize: Int!) {
    artwork(id: $id) {
      ...ArtworkGridItem_artwork @arguments(imageSize: $imageSize)
    }
  }
`
