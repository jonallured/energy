import { AlbumListImageQuery } from "__generated__/AlbumListImageQuery.graphql"
import { ImageProps } from "react-native"
import { graphql } from "react-relay"
import { useSystemFetchQuery } from "system/relay/useSystemFetchQuery"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { CachedImage } from "system/wrappers/CachedImage"
import { useScreenDimensions } from "utils/hooks/useScreenDimensions"

interface AlbumListImageProps {
  slug: string
  style?: ImageProps["style"]
  image: SelectedItemArtwork["image"]
}

export const AlbumListImage: React.FC<AlbumListImageProps> = ({ slug, style, image }) => {
  const placeholderHeight = useScreenDimensions().height / 5

  // Fetch the artwork to validate that it exists, if not, delete from library
  useSystemFetchQuery<AlbumListImageQuery>({
    query: albumsQuery,
    variables: {
      slug,
    },
    onError: (error) => {
      // If not found, assume a 404 and remove the artwork from the users album
      if ((error.message as string).includes("Artwork Not Found")) {
        // FIXME; this should be internalID
        GlobalStore.actions.albums.removeItemFromAlbums(slug)
      }
    },
  })

  if (!image) {
    return null
  }

  return (
    <CachedImage
      uri={image?.resized?.url as string}
      aspectRatio={image?.aspectRatio}
      style={[style]}
      placeholderHeight={placeholderHeight}
    />
  )
}

const albumsQuery = graphql`
  query AlbumListImageQuery($slug: String!) {
    artwork(id: $slug) {
      internalID
    }
  }
`
