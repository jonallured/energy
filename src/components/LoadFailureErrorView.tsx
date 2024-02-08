import {
  BoxProps,
  Button,
  Flex,
  ReloadIcon,
  Text,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import { debounce } from "lodash"
import { useRef, useState } from "react"
import { Animated, Easing } from "react-native"
import { useRouter } from "system/hooks/useRouter"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

interface LoadFailureErrorViewProps {
  error?: Error
  onRetry?: () => void
}

export const LoadFailureErrorView: React.FC<
  LoadFailureErrorViewProps & BoxProps
> = ({ error, onRetry, ...restProps }) => {
  const { router } = useRouter()
  const color = useColor()
  const isDarkMode = useIsDarkMode()
  const spinAnimation = useRef(new Animated.Value(0)).current
  const [isAnimating, setIsAnimating] = useState(false)

  const playAnimation = () => {
    setIsAnimating(true)
    Animated.loop(
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start()
  }

  return (
    <Flex flex={1} alignItems="center" justifyContent="center" {...restProps}>
      <Text variant="lg-display">Unable to load</Text>
      {/* TODO: Remove */}
      <Button variant="outline" onPress={() => router.goBack()}>
        Back
      </Button>
      <Text variant="sm-display" mb={1}>
        Please try again
      </Text>
      <Touchable
        onPress={debounce(() => {
          if (!isAnimating) {
            playAnimation()
          }
          onRetry?.()
        })}
        underlayColor={color("black5")}
        haptic
        style={{
          height: 40,
          width: 40,
          borderRadius: 20,
          borderColor: color("black10"),
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
            transform: [
              {
                rotate: spinAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          }}
        >
          <ReloadIcon
            height={25}
            width={25}
            fill={isDarkMode ? "white100" : "black100"}
          />
        </Animated.View>
      </Touchable>
      <Flex m={2}>
        <Text>Error: {error?.message}</Text>
      </Flex>
    </Flex>
  )
}
