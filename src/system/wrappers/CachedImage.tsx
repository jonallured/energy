import { useColor, useSpace } from "@artsy/palette-mobile"
import { ImagePlaceholder } from "components/ImagePlaceholder"
import React, { useRef } from "react"
import { Image, ImageProps, Platform } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useLocalUri } from "system/sync/fileCache"
import { useScreenDimensions } from "utils/hooks/useScreenDimensions"

interface CachedImageProps extends Omit<ImageProps, "source"> {
  width?: string | number | undefined
  height?: string | number | undefined
  placeholderHeight?: number | undefined
  aspectRatio?: number | null | undefined
  uri: string | undefined
  fadeInOnLoad?: boolean
}

export const CachedImage: React.FC<CachedImageProps> = React.memo(
  ({ fadeInOnLoad = true, style, uri, width, height, aspectRatio = 1, ...restProps }) => {
    const isDoneLoading = useRef(false)
    const color = useColor()
    const space = useSpace()
    const screenDimensions = useScreenDimensions()

    const initialOpacity = Platform.OS === "ios" ? 0.2 : 1
    const opacity = useSharedValue(fadeInOnLoad ? initialOpacity : 1)

    const fadeInAnimStyle = useAnimatedStyle(() => ({ opacity: opacity.value }), [])
    const localUri = useLocalUri(uri ?? "")

    const handleOnLoad = () => {
      opacity.value = withTiming(1, { duration: 200, easing: Easing.ease })
    }

    if (uri === undefined || localUri === undefined) {
      return <ImagePlaceholder height={restProps.placeholderHeight} />
    }

    if (opacity.value === 1) {
      isDoneLoading.current = true
    }

    const initialStyle = {
      ...(style as object),
      aspectRatio,
      width,
      height,
      maxWidth: screenDimensions.width - space(4),
    }

    // Hack to get around the lack of memoization support in `useSharedValue` and
    // needed to prevent the opacity from resetting to 0 on rerenders.
    let ImageWrapper: any
    let styleProps
    if (isDoneLoading.current === true) {
      ImageWrapper = Image
      styleProps = [initialStyle]
    } else {
      ImageWrapper = Animated.Image
      styleProps = [initialStyle, fadeInAnimStyle]
    }

    return (
      <ImageWrapper
        backgroundColor={color("black30")}
        {...restProps}
        style={styleProps}
        source={{ uri: localUri ?? uri }}
        onLoad={handleOnLoad}
      />
    )
  },
  (prevProps, nextProps) => prevProps.uri === nextProps.uri
)
