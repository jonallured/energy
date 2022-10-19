import { Spacer } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArrowLeftIcon, Flex, Text, Touchable } from "palette"

export const HEADER_HEIGHT = 44

interface HeaderProps {
  leftElements?: React.ReactNode
  label?: string
  noBackButton?: boolean
  rightElements?: React.ReactNode
  safeAreaInsets?: boolean
  positionAbsolute?: boolean
  onPress?: () => void
}

/**
 * @deprecated Start using `Screen` with `Screen.Header`.
 */
export const Header = ({
  leftElements,
  label,
  noBackButton,
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
        !noBackButton && (
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
