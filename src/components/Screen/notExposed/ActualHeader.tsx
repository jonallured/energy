import {
  DEFAULT_HIT_SLOP,
  Spacer,
  ArrowLeftIcon,
  Flex,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { useSetHandledTopSafeArea } from "components/Screen/atoms"
import { isTablet } from "react-native-device-info"
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated"
import { GlobalStore } from "system/store/GlobalStore"

export const NAVBAR_HEIGHT = 44

export interface ActualHeaderProps {
  title?: string

  onBack?: () => void

  leftElements?: React.ReactNode
  rightElements?: React.ReactNode

  hideLeftElements?: boolean
  hideRightElements?: boolean

  animatedTitle?: boolean
  titleShown?: boolean
}

export const ActualHeader = ({
  leftElements,
  hideLeftElements,
  rightElements,
  hideRightElements,
  title,
  onBack,
  animatedTitle = false,
  titleShown = false,
}: ActualHeaderProps) => {
  useSetHandledTopSafeArea(true)

  const navigation = useNavigation()
  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )

  const actualLeftElements = (() => {
    switch (true) {
      case hideLeftElements: {
        return null
      }
      case leftElements !== undefined: {
        return leftElements
      }
      default: {
        return (
          <Touchable
            onPress={onBack ? onBack : () => navigation.goBack()}
            underlayColor="transparent"
            hitSlop={DEFAULT_HIT_SLOP}
          >
            <ArrowLeftIcon fill="onBackgroundHigh" />
          </Touchable>
        )
      }
    }
  })()

  const actualRightElements = (() => {
    switch (true) {
      case hideRightElements: {
        return null
      }
      default: {
        return rightElements
      }
    }
  })()

  const actualTitle = (
    <Text variant="md" numberOfLines={1}>
      {title}
    </Text>
  )

  return (
    <Flex height={NAVBAR_HEIGHT} flexDirection="row" px={2}>
      {!!actualLeftElements && (
        <Flex flexDirection="row" alignItems="center">
          {actualLeftElements}
          <Spacer x={1} />
        </Flex>
      )}

      {!isSelectModeActive && (
        <Flex flex={1} flexDirection="row" alignItems="center">
          {title !== undefined &&
            (animatedTitle
              ? titleShown && (
                  <Animated.View
                    entering={FadeInLeft}
                    exiting={FadeOutLeft}
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      flex: 1,
                    }}
                  >
                    <Flex width={isTablet() ? "100%" : "70%"}>{actualTitle}</Flex>
                  </Animated.View>
                )
              : actualTitle)}
        </Flex>
      )}

      {!!actualRightElements && (
        <Flex flexDirection="row" alignItems="center">
          <Spacer x={1} />
          {actualRightElements}
        </Flex>
      )}
    </Flex>
  )
}
