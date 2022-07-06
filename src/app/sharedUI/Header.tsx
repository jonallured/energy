import { useNavigation } from "@react-navigation/native"
import { Flex, Text, Touchable, ArrowLeftIcon } from "palette"

type HeaderProps = {
  label: string
  rightElements?: Element
}

export const Header = ({ label, rightElements }: HeaderProps) => {
  const navigation = useNavigation()
  return (
    <Flex px={2} mt={2}>
      <Touchable
        onPress={() => {
          navigation.goBack()
        }}
      >
        <ArrowLeftIcon fill="black100" />
      </Touchable>
      <Flex flexDirection="row" mt={2} alignItems="center">
        <Text variant="lg">{label}</Text>
        {rightElements}
      </Flex>
    </Flex>
  )
}
