import { Flex } from "@artsy/palette-mobile"
import { range } from "lodash"
import { useEffect } from "react"
import { Text as RNText, TextProps } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

export const AnimatedEllipsis = ({
  numberOfDots = 3,
  style,
  minOpacity = 0.3,
}: {
  numberOfDots?: number
  style?: TextProps["style"]
  minOpacity?: number
}) => {
  const timing = useSharedValue(0)
  useEffect(() => {
    timing.value = withRepeat(withTiming(1, { duration: 1000 }), -1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Flex flexDirection="row">
      {range(numberOfDots).map((i) => (
        <Dot
          timing={timing}
          minOpacity={minOpacity}
          style={style}
          index={i}
          numberOfDots={numberOfDots}
          key={i}
        />
      ))}
    </Flex>
  )
}

const Dot = ({
  timing,
  index,
  numberOfDots,
  style,
  minOpacity,
}: {
  timing: SharedValue<number>
  index: number
  numberOfDots: number
  style: TextProps["style"]
  minOpacity: number
}) => {
  const parts = 3
  const totalParts = numberOfDots + 2 * parts // for smoother animation overlap
  const fadeLoopAnim = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        timing.value,
        [
          index / totalParts,
          (index + parts) / totalParts,
          (index + 2 * parts) /* the last value should be the same value as `totalParts` */ /
            totalParts,
        ],
        [minOpacity, 1, minOpacity],
        Extrapolation.CLAMP
      ),
    }),
    []
  )

  const defaultStyle: TextProps["style"] = {
    color: "black",
    fontSize: 26,
    top: -1,
  }

  return (
    <Animated.View style={fadeLoopAnim}>
      <RNText style={[defaultStyle, style]}>.</RNText>
    </Animated.View>
  )
}
