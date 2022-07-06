import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtworkItemQuery } from "__generated__/ArtworkItemQuery.graphql"
import { ArtworkGridItem } from "./ArtworkGridItem"

export const ArtworkItem = ({ artworkId }: { artworkId: string }) => {
  const artworkData = useLazyLoadQuery<ArtworkItemQuery>(artworkItemQuery, { id: artworkId })
  return <ArtworkGridItem artwork={artworkData.artwork!} />
}

const artworkItemQuery = graphql`
  query ArtworkItemQuery($id: String!) {
    artwork(id: $id) {
      ...ArtworkGridItem_artwork
    }
  }
`
