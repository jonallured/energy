import { Image, ImageProps } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { AlbumListImageQuery } from "__generated__/AlbumListImageQuery.graphql"
import { useScreenDimensions } from "shared/hooks"
import { ImagePlaceholder } from "../molecules"

interface AlbumListImageProps {
  slug: string
  style?: ImageProps["style"]
}

export const AlbumListImage = ({ slug, style }: AlbumListImageProps) => {
  const albumImages = useLazyLoadQuery<AlbumListImageQuery>(albumsQuery, { slug })
  const placeHolderHeight = useScreenDimensions().height / 5
  const albumListImage = albumImages.artwork?.image

  if (!albumListImage?.url) {
    return <ImagePlaceholder height={placeHolderHeight} />
  }

  return (
    <Image
      source={{ uri: albumListImage?.url }}
      style={[style, { aspectRatio: albumListImage?.aspectRatio ?? 1 }]}
    />
  )
}

const albumsQuery = graphql`
  query AlbumListImageQuery($slug: String!) {
    artwork(id: $slug) {
      image {
        url
        aspectRatio
      }
    }
  }
`
