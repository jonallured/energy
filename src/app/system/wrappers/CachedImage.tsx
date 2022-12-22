import { Image, ImageProps } from "react-native"
import { ImagePlaceholder } from "app/components/ImagePlaceholder"
import { useLocalUri } from "app/system/sync/fileCache"

interface CachedImageProps extends Omit<ImageProps, "source"> {
  placeholderHeight: number | null | undefined
  uri: string | undefined
}

export const CachedImage: React.FC<CachedImageProps> = ({
  placeholderHeight,
  uri,
  ...restProps
}) => {
  const localUri = useLocalUri(uri ?? "")

  if (!uri && !localUri) {
    return <ImagePlaceholder height={placeholderHeight ?? 0} />
  }

  return <Image {...restProps} source={{ uri: localUri ?? uri }} />
}
