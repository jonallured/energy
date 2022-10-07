import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArrowLeftIcon, Flex, Text, Touchable } from "palette"
import { Spacer } from "@artsy/palette-mobile"

export const HEADER_HEIGHT = 44

interface HeaderProps {
  leftElements?: React.ReactNode
  label?: string
  withoutBackButton?: boolean
  rightElements?: React.ReactNode
  safeAreaInsets?: boolean
  positionAbsolute?: boolean
  onPress?: () => void
}

export const Header = ({
  leftElements,
  label,
  withoutBackButton,
  rightElements,
  safeAreaInsets,
  positionAbsolute,
  onPress,
}: HeaderProps) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const onBackButtonPress = () => {
    navigation.goBack()
    onPress?.()
  }

  return (
    <Flex
      height={HEADER_HEIGHT}
      flexDirection="row"
      alignItems="center"
      px={2}
      mt={safeAreaInsets ? insets.top : 0}
      position={positionAbsolute ? "absolute" : "relative"}
    >
      {leftElements !== undefined ? (
        <>
          {leftElements}
          <Spacer x={1} />
        </>
      ) : (
        !withoutBackButton && (
          <>
            <Touchable
              onPress={onBackButtonPress}
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
            <Spacer x={1} />
          </>
        )
      )}

      {label !== undefined && <Text variant="lg">{label}</Text>}

      {rightElements !== undefined && (
        <>
          <Flex flex={1} />
          {rightElements}
        </>
      )}
    </Flex>
  )
}
