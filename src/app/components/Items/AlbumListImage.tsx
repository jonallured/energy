import { AlbumListImageQuery } from "__generated__/AlbumListImageQuery.graphql"
import { useSystemFetchQuery } from "app/system/relay/useSystemFetchQuery"
import { GlobalStore } from "app/system/store/GlobalStore"
import { CachedImage } from "app/system/wrappers/CachedImage"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { imageSize } from "app/utils/imageSize"
import { ImageProps } from "react-native"
import { graphql } from "react-relay"

interface AlbumListImageProps {
  slug: string
  style?: ImageProps["style"]
}

export const AlbumListImage = ({ slug, style }: AlbumListImageProps) => {
  const placeholderHeight = useScreenDimensions().height / 5
  const albumListImage = useSystemFetchQuery<AlbumListImageQuery>({
    query: albumsQuery,
    variables: {
      slug,
      imageSize,
    },
    onError: (error) => {
      // If not found, assume a 404 and remove the artwork from the users album
      if ((error.message as string).includes("Artwork Not Found")) {
        // FIXME; this should be internalID
        GlobalStore.actions.albums.removeItemFromAlbums(slug)
      }
    },
  })

  const image = albumListImage?.artwork?.image

  if (!image) {
    return null
  }

  return (
    <CachedImage
      uri={image?.resized?.url}
      placeholderHeight={placeholderHeight}
      style={[style, { aspectRatio: image?.aspectRatio ?? 1 }]}
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
