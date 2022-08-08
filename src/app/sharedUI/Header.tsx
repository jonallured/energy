import { ArrowLeftIcon, Flex, Text, Touchable } from "palette"
import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const HEADER_HEIGHT = 44

type HeaderProps = {
  label?: string
  rightElements?: Element
}

export const Header = ({ label, rightElements }: HeaderProps) => {
  const navigation = useNavigation()
  const safeAreaInsets = useSafeAreaInsets()
  return (
    <Flex px={2} pt={safeAreaInsets.top}>
      <Flex height={HEADER_HEIGHT} justifyContent="center">
        <Touchable onPress={() => navigation.goBack()}>
          <ArrowLeftIcon fill="black100" />
        </Touchable>
      </Flex>
      {label ? (
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" pb={1}>
          <Flex flex={1}>
            <Text variant="lg">{label}</Text>
          </Flex>
          {rightElements}
        </Flex>
      ) : null}
    </Flex>
  )
}
