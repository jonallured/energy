import { useEffect } from "react"
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

interface AnimationProps {
  startAnimation: boolean | undefined
}

export const useSlideUpFromBottomAnimation = ({ startAnimation = false }: AnimationProps) => {
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(0)

  const slideUpFromBottomStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: startAnimation ? 400 : 200 }),
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 400,
            easing: startAnimation ? Easing.out(Easing.exp) : Easing.in(Easing.sin),
          }),
        },
      ],
    }
  })

  useEffect(() => {
    if (startAnimation) {
      opacity.value = 1
      translateY.value = 0
    } else {
      opacity.value = 0
      translateY.value = 400
    }
  }, [startAnimation])

  return {
    slideUpFromBottomStyles,
  }
}
