import { useRef } from "react"
import { Image, ImageProps } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { ImagePlaceholder } from "app/components/ImagePlaceholder"
import { useLocalUri } from "app/system/sync/fileCache"

interface CachedImageProps extends Omit<ImageProps, "source"> {
  placeholderHeight: number | null | undefined
  uri: string | undefined
  fadeInOnLoad?: boolean
}

export const CachedImage: React.FC<CachedImageProps> = ({
  fadeInOnLoad = true,
  placeholderHeight,
  style,
  uri,
  ...restProps
}) => {
  const isDoneLoading = useRef(false)
  const opacity = useSharedValue(fadeInOnLoad ? 0 : 1)
  const fadeInAnimStyle = useAnimatedStyle(() => ({ opacity: opacity.value }), [])
  const localUri = useLocalUri(uri ?? "")

  const handleOnLoad = () => {
    opacity.value = withTiming(1, { duration: 200, easing: Easing.ease })
  }

  if (uri === undefined || localUri === undefined) {
    return <ImagePlaceholder height={placeholderHeight ?? 0} />
  }

  if (opacity.value === 1) {
    isDoneLoading.current = true
  }

  // Hack to get around the lack of memoization support in `useSharedValue` and
  // needed to prevent the opacity from resetting to 0 on rerenders.
  let ImageWrapper: any
  let styleProps
  if (isDoneLoading.current === true) {
    ImageWrapper = Image
    styleProps = [style]
  } else {
    ImageWrapper = Animated.Image
    styleProps = [style, fadeInAnimStyle]
  }

  return (
    <ImageWrapper
      {...restProps}
      style={styleProps}
      source={{ uri: localUri ?? uri }}
      onLoad={handleOnLoad}
    />
  )
}
