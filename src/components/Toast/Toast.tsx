import { Flex, Box, useColor, Text, Touchable, NAVBAR_HEIGHT } from "@artsy/palette-mobile"
import { useToast } from "components/Toast/ToastContext"
import { Animated, StyleProp, ViewStyle } from "react-native"
import { useScreenDimensions } from "utils/hooks/useScreenDimensions"

export const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const EDGE_POPOVER_MESSAGE_PADDING = 10

export type ToastPlacement = "top" | "bottom"
export type ToastType = "info" | "success" | "error" | "default"
export type ToastItem = Omit<ToastProps, "translateYAnimation" | "opacityAnimation">
export type ToastPointerType = "top" | "bottom"

export interface ToastProps {
  autoHide?: boolean
  hideTimeout?: number
  message?: string
  onPress?: () => void
  onUndoPress?: () => void
  opacityAnimation: Animated.Value
  placement?: ToastPlacement
  style?: StyleProp<ViewStyle>
  title: string
  translateYAnimation: Animated.Value
  type?: ToastType
  withPointer?: ToastPointerType
}

export const useColorsByType = (type?: ToastType) => {
  const color = useColor()

  if (type === "success") {
    return {
      descriptionColor: color("green10"),
      backgroundColor: color("green100"),
    }
  }

  if (type === "info") {
    return {
      descriptionColor: color("blue10"),
      backgroundColor: color("blue100"),
    }
  }

  if (type === "error") {
    return {
      descriptionColor: color("red10"),
      backgroundColor: color("red100"),
    }
  }

  return {
    descriptionColor: color("black10"),
    backgroundColor: color("black100"),
  }
}

// TODO: Remove NAVBAR_HEIGHT when a new design without a floating back button is added
export const Toast: React.FC<ToastProps> = (props) => {
  const {
    placement = "top",
    title,
    message,
    type,
    style,
    withPointer,
    translateYAnimation,
    opacityAnimation,
    onPress,
    onUndoPress,
  } = props
  const { safeAreaInsets } = useScreenDimensions()
  const { toast } = useToast()
  const colors = useColorsByType(type)

  const handleToastPress = () => {
    toast.hide()
    onPress?.()
  }

  const handleToastUndoPress = () => {
    toast.hide()
    onUndoPress?.()
  }

  const range = [-50, 0]
  const outputRange = placement === "top" ? range : range.map((item) => item * -1)
  const translateY = translateYAnimation.interpolate({ inputRange: [0, 1], outputRange })
  const opacity = opacityAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })

  const Pointer = () => {
    return (
      <Flex
        width={0}
        height={0}
        backgroundColor="transparent"
        borderStyle="solid"
        alignSelf="center"
        borderLeftWidth={10}
        borderRightWidth={10}
        borderBottomWidth={12}
        borderLeftColor="transparent"
        borderRightColor="transparent"
        borderBottomColor="black100"
        style={{
          transform: [{ rotate: rotatePointer({ pointerDirection: withPointer }).rotate }],
        }}
      />
    )
  }

  const content = (
    // @ts-ignore
    <Flex flexDirection={rotatePointer({ pointerDirection: withPointer }).flexDirection}>
      <Flex py={1} px={2} backgroundColor={colors.backgroundColor}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flex={1} mr={!!onUndoPress ? 1 : 0}>
            <Text color="white100" variant="sm-display" textAlign={withPointer ? "center" : "left"}>
              {title}
            </Text>
            {!!message && (
              <Text color={colors.descriptionColor} variant="xs">
                {message}
              </Text>
            )}
          </Flex>
          {!!onUndoPress && (
            <Box>
              <Touchable noFeedback onPress={handleToastUndoPress}>
                <Text
                  variant="xs"
                  color={colors.descriptionColor}
                  style={{ textDecorationLine: "underline" }}
                >
                  Undo
                </Text>
              </Touchable>
            </Box>
          )}
        </Flex>
      </Flex>
      {!!withPointer && <Pointer />}
    </Flex>
  )

  return (
    <AnimatedFlex
      position="absolute"
      left="1"
      right="1"
      bottom={
        placement === "bottom" ? safeAreaInsets.bottom + EDGE_POPOVER_MESSAGE_PADDING : undefined
      }
      top={
        placement === "top"
          ? safeAreaInsets.top + EDGE_POPOVER_MESSAGE_PADDING + NAVBAR_HEIGHT
          : undefined
      }
      style={[
        {
          opacity,
          transform: [{ translateY }],
          zIndex: 99999,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
        style,
      ]}
    >
      {typeof onPress !== "undefined" ? (
        <Touchable noFeedback onPress={handleToastPress}>
          {content}
        </Touchable>
      ) : (
        content
      )}
    </AnimatedFlex>
  )
}

const rotatePointer = ({ pointerDirection }: { pointerDirection?: ToastPointerType }) => {
  switch (pointerDirection) {
    case "bottom":
      return {
        rotate: "180deg",
        flexDirection: "column",
      }
    case "top":
    default:
      return {
        rotate: "0deg",
        flexDirection: "column-reverse",
      }
  }
}
