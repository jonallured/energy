import {
  ArrowLeftIcon,
  DEFAULT_HIT_SLOP,
  Flex,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { NAVBAR_HEIGHT, ZINDEX } from "components/Screen/constants"
import { TabsContext } from "components/Tabs/TabsContext"
import { isTablet } from "react-native-device-info"
import Animated, { Easing, FadeInLeft, FadeOut } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GlobalStore } from "system/store/GlobalStore"

export interface HeaderProps {
  animated?: boolean
  hideLeftElements?: boolean
  hideRightElements?: boolean
  leftElements?: React.ReactNode
  onBack?: () => void
  rightElements?: React.ReactNode
  scrollY?: number
  title?: string
  titleShown?: boolean
}

export const AnimatedTabsHeader: React.FC<HeaderProps> = (props) => {
  const scrollY = TabsContext.useStoreState((state) => state.currentScrollY)

  return <Header scrollY={scrollY} animated={true} {...props} />
}

export const Header: React.FC<HeaderProps> = ({
  animated = false,
  scrollY = 0,
  hideLeftElements,
  hideRightElements,
  leftElements,
  onBack,
  rightElements,
  title,
}) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )

  const Left = () => {
    if (hideLeftElements) {
      return null
    }

    return (
      <>
        {leftElements ? (
          <>{leftElements}</>
        ) : (
          // If no left elements passed, show back button
          <Touchable
            onPress={onBack ?? navigation.goBack}
            underlayColor="transparent"
            hitSlop={DEFAULT_HIT_SLOP}
          >
            <ArrowLeftIcon fill="onBackgroundHigh" marginLeft="-4px" top="1px" />
          </Touchable>
        )}

        <Spacer x={1} />
      </>
    )
  }

  const Center = () => {
    if (isSelectModeActive) {
      return null
    }

    if (!animated) {
      return (
        <Flex width={isTablet() ? "100%" : "70%"} flex={1}>
          <Text variant="md" numberOfLines={1}>
            {title}
          </Text>
        </Flex>
      )
    }

    if (scrollY < NAVBAR_HEIGHT) {
      return <Flex flex={1} flexDirection="row" />
    }

    return (
      <>
        <Animated.View
          entering={FadeInLeft.duration(400).easing(Easing.out(Easing.exp))}
          exiting={FadeOut.duration(400).easing(Easing.out(Easing.exp))}
          style={{
            flex: 1,
          }}
        >
          <Flex width={isTablet() ? "100%" : "70%"}>
            <Text variant="md" numberOfLines={1}>
              {title}
            </Text>
          </Flex>
        </Animated.View>
      </>
    )
  }

  const Right = () => {
    if (hideRightElements) {
      return null
    }

    return (
      <>
        <Spacer x={1} />

        {rightElements}
      </>
    )
  }

  return (
    <Flex
      height={NAVBAR_HEIGHT}
      flexDirection="row"
      px={2}
      top={insets.top}
      zIndex={ZINDEX.header}
      backgroundColor="background"
      alignItems="center"
    >
      <Left />
      <Center />
      <Right />
    </Flex>
  )
}
