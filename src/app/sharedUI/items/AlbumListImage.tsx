import { SuspenseWrapper } from "app/wrappers/SuspenseWrapper"
import { Image, ImageProps } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { AlbumListImageQuery } from "__generated__/AlbumListImageQuery.graphql"

interface AlbumListImageProps {
  slug: string
  style?: ImageProps["style"]
}

export const AlbumListImage = (props: AlbumListImageProps) => (
  <SuspenseWrapper withTabs>
    <RenderAlbumListImage {...props} />
  </SuspenseWrapper>
)

const RenderAlbumListImage = ({ slug, style }: AlbumListImageProps) => {
  const albumImages = useLazyLoadQuery<AlbumListImageQuery>(albumsQuery, { slug })

  return (
    <Image
      source={{
        uri: Image.resolveAssetSource({ uri: albumImages.artwork?.image?.url! }).uri,
      }}
      style={[style, { aspectRatio: albumImages.artwork?.image?.aspectRatio ?? 1 }]}
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
