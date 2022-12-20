import { Image, ImageProps } from "react-native"
import { ImagePlaceholder } from "app/components/ImagePlaceholder"
import { useCachedOrFetchUrl } from "app/system/sync/fileCache"

interface CachedImageProps extends Omit<ImageProps, "source"> {
  placeholderHeight: number | null | undefined
  uri: string | undefined
}

export const CachedImage: React.FC<CachedImageProps> = ({ placeholderHeight, ...imageProps }) => {
  const uri = useCachedOrFetchUrl(imageProps.uri ?? "")

  if (!uri) {
    return <ImagePlaceholder height={placeholderHeight ?? 0} />
  }

  return <Image {...imageProps} source={{ uri }} />
}
