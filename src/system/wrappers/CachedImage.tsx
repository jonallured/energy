import {
  Flex,
  useColor,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { ImagePlaceholder } from "components/ImagePlaceholder"
import { MotiView } from "moti"
import React, { useRef } from "react"
import { ActivityIndicator, Image, ImageProps, Platform } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useLocalUri } from "system/sync/fileCache/useLocalUri"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

interface CachedImageProps extends Omit<ImageProps, "source"> {
  aspectRatio?: number | null | undefined
  backgroundColor?: string
  fadeInOnLoad?: boolean
  height?: string | number | undefined
  placeholderHeight?: number | undefined
  uri: string | undefined
  width?: string | number | undefined
}

export const CachedImage: React.FC<CachedImageProps> = React.memo(
  ({
    aspectRatio = 1,
    backgroundColor,
    fadeInOnLoad = true,
    height,
    style,
    uri,
    width,
    ...restProps
  }) => {
    const screenDimensions = useScreenDimensions()
    const isDoneLoading = useRef(false)
    const isDarkMode = useIsDarkMode()
    const color = useColor()
    const space = useSpace()

    const initialOpacity = Platform.OS === "ios" ? 0.0 : 1
    const opacity = useSharedValue(fadeInOnLoad ? initialOpacity : 1)

    const fadeInAnimStyle = useAnimatedStyle(
      () => ({ opacity: opacity.value }),
      []
    )
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

    const bgColor = backgroundColor
      ? backgroundColor
      : isDarkMode
      ? "#222"
      : color("black10")

    return (
      <Flex
        width={width}
        height={height}
        backgroundColor={bgColor}
        flex={1}
        alignContent="center"
        justifyContent="center"
      >
        {!isDoneLoading.current && (
          <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            position="absolute"
          >
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 0.5 }}>
              <ActivityIndicator color={isDarkMode ? "white" : "black"} />
            </MotiView>
          </Flex>
        )}
        <ImageWrapper
          backgroundColor={bgColor}
          {...restProps}
          style={styleProps}
          source={{ uri: localUri ?? uri }}
          onLoad={handleOnLoad}
        />
      </Flex>
    )
  },
  (prevProps, nextProps) => prevProps.uri === nextProps.uri
)
