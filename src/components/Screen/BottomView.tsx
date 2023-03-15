import { Flex, Spacer, useColor } from "@artsy/palette-mobile"
import { SCREEN_HORIZONTAL_PADDING } from "components/Screen/constants"
import { useEffect, useState } from "react"
import { EmitterSubscription, Keyboard } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GlobalStore } from "system/store/GlobalStore"

export const BottomView: React.FC = ({ children }) => {
  const insets = useSafeAreaInsets()
  const color = useColor()
  const isDarkMode = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme) === "dark"

  const [keyboardShowing, keyboardHeight] = useKeyboard()

  const animatedBottom = useSharedValue(0)
  const slideButtonStyle = useAnimatedStyle(
    () => ({
      bottom: animatedBottom.value,
    }),
    [keyboardShowing]
  )

  useEffect(() => {
    animatedBottom.value = withTiming(keyboardShowing ? keyboardHeight - insets.bottom : 0, {
      duration: 510,
      easing: Easing.out(Easing.exp),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardShowing])

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
        },
        slideButtonStyle,
      ]}
    >
      <LinearGradient
        colors={[isDarkMode ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)", color("background")]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          width: "100%",
          height: 20,
        }}
        pointerEvents="none"
      />
      <Flex
        px={SCREEN_HORIZONTAL_PADDING}
        pt={1}
        pb={keyboardShowing ? 1 : undefined}
        backgroundColor="background"
      >
        {children}
      </Flex>

      {keyboardShowing ? null : <SafeBottomPadding />}
    </Animated.View>
  )
}

/**
 * If there is a bottom safe area, this will render nothing.
 * If there is no bottom safe area, this will render a small padding.
 *
 * This is useful for texts/buttons that are at the bottom, and with safe area
 * they seem like they have enough space underneath, but with no safe area they
 * look stuck at the bottom.
 */
export const SafeBottomPadding = () => {
  const insets = useSafeAreaInsets()

  if (insets.bottom > 0) {
    return null
  }

  return <Spacer y={2} />
}

const useKeyboard = (): [keyboardShowing: boolean, keyboardHeight: number] => {
  const [keyboardShowing, setKeyboardShowing] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const listeners: EmitterSubscription[] = []
    listeners.push(
      Keyboard.addListener(
        "keyboardWillShow", // ios only event
        (e) => {
          setKeyboardHeight(e.endCoordinates.height)
          setKeyboardShowing(true)
        }
      )
    )
    listeners.push(
      Keyboard.addListener(
        "keyboardDidShow", // android event
        (e) => {
          setKeyboardHeight(e.endCoordinates.height)
          setKeyboardShowing(true)
        }
      )
    )
    listeners.push(
      Keyboard.addListener(
        "keyboardWillHide", // ios only event
        () => setKeyboardShowing(false)
      )
    )
    listeners.push(
      Keyboard.addListener(
        "keyboardDidHide", // android event
        () => setKeyboardShowing(false)
      )
    )
    return () => {
      listeners.map((l) => l.remove())
    }
  }, [])

  return [keyboardShowing, keyboardHeight]
}
