import { ImageProps } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { AlbumListImageQuery } from "__generated__/AlbumListImageQuery.graphql"
import { CachedImage } from "app/system/wrappers/CachedImage"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { imageSize } from "app/utils/imageSize"

interface AlbumListImageProps {
  slug: string
  style?: ImageProps["style"]
}

export const AlbumListImage = ({ slug, style }: AlbumListImageProps) => {
  const placeholderHeight = useScreenDimensions().height / 5
  const albumImages = useLazyLoadQuery<AlbumListImageQuery>(albumsQuery, { slug, imageSize })
  const albumListImage = albumImages.artwork?.image

  return (
    <CachedImage
      uri={albumListImage?.resized?.url}
      placeholderHeight={placeholderHeight}
      style={[style, { aspectRatio: albumListImage?.aspectRatio ?? 1 }]}
    />
  )
}

const albumsQuery = graphql`
  query AlbumListImageQuery($slug: String!, $imageSize: Int!) {
    artwork(id: $slug) {
      image {
        resized(width: $imageSize, version: "normalized") {
          height
          url
        }
        aspectRatio
      }
    }
  }
`
