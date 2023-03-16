import { useEffect } from "react"
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

interface AnimationProps {
  startAnimation: boolean | undefined
}

export const useFadeInAnimation = ({ startAnimation = false }: AnimationProps) => {
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  const fadeInStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value),
      transform: [
        {
          scale: withTiming(scale.value, { duration: 200 }),
        },
      ],
    }
  })

  useEffect(() => {
    if (startAnimation) {
      opacity.value = 1
      scale.value = 1
    } else {
      opacity.value = 0
      scale.value = 0
    }
  }, [startAnimation])

  return {
    fadeInStyles,
  }
}
