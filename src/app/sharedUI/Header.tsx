import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArrowLeftIcon, Flex, Spacer, Text, Touchable } from "palette"

export const HEADER_HEIGHT = 44

interface HeaderProps {
  leftElements?: React.ReactNode
  label?: string
  withoutBackButton?: boolean
  rightElements?: React.ReactNode
}

export const Header = ({ leftElements, label, withoutBackButton, rightElements }: HeaderProps) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  return (
    <Flex height={HEADER_HEIGHT} flexDirection="row" alignItems="center" px={2} mt={insets.top}>
      {leftElements !== undefined ? (
        <>
          {leftElements}
          <Spacer x={1} />
        </>
      ) : withoutBackButton ? null : (
        <>
          <Touchable onPress={() => navigation.goBack()}>
            <ArrowLeftIcon fill="onBackgroundHigh" />
          </Touchable>
          <Spacer x={1} />
        </>
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
