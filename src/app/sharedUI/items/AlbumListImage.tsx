import { Image, ImageProps } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { AlbumListImageQuery } from "__generated__/AlbumListImageQuery.graphql"
import { ImagePlaceholder } from "app/sharedUI/molecules"
import { imageSize } from "app/utils/imageSize"
import { useScreenDimensions } from "shared/hooks"

interface AlbumListImageProps {
  slug: string
  style?: ImageProps["style"]
}

export const AlbumListImage = ({ slug, style }: AlbumListImageProps) => {
  const albumImages = useLazyLoadQuery<AlbumListImageQuery>(albumsQuery, { slug, imageSize })
  const placeHolderHeight = useScreenDimensions().height / 5
  const albumListImage = albumImages.artwork?.image

  if (!albumListImage?.resized?.url) {
    return <ImagePlaceholder height={placeHolderHeight} />
  }

  return (
    <Image
      source={{ uri: albumListImage.resized.url }}
      style={[style, { aspectRatio: albumListImage?.aspectRatio ?? 1 }]}
    />
  )
}

const albumsQuery = graphql`
  query AlbumListImageQuery($slug: String!, $imageSize: Int!) {
    artwork(id: $slug) {
      image {
        resized(width: $imageSize, version: "normalized") {
          url
        }
        aspectRatio
      }
    }
  }
`
