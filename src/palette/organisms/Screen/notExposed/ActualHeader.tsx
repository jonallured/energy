import { Spacer } from "@artsy/palette-mobile"
import { ArrowLeftIcon, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated"
import { useSetHandledTopSafeArea } from "../atoms"

export const NAVBAR_HEIGHT = 44

export interface ActualHeaderProps {
  title?: string

  noBackButton?: boolean
  onBack?: () => void

  leftElements?: React.ReactNode
  rightElements?: React.ReactNode

  animatedTitle?: boolean
  titleShown?: boolean
}

export const ActualHeader = ({
  noBackButton,
  onBack,
  leftElements,
  title,
  rightElements,
  animatedTitle = false,
  titleShown = false,
}: ActualHeaderProps) => {
  useSetHandledTopSafeArea(true)

  const navigation = useNavigation()

  let actualLeftElements: React.ReactNode = (
    <Touchable
      onPress={onBack ? onBack : () => navigation.goBack()}
      underlayColor="transparent"
      hitSlop={{
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      }}
    >
      <ArrowLeftIcon fill="onBackgroundHigh" />
    </Touchable>
  )
  if (noBackButton) {
    actualLeftElements = null
  }
  if (leftElements !== undefined) {
    actualLeftElements = leftElements
  }

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
                  {actualTitle}
                </Animated.View>
              )
            : actualTitle)}
      </Flex>

      {!!rightElements && (
        <Flex flexDirection="row" alignItems="center">
          <Spacer x={1} />
          {rightElements}
        </Flex>
      )}
    </Flex>
  )
}
