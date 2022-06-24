import { useNavigation } from "@react-navigation/native"
import { Flex, Text, Touchable, ArrowLeftIcon } from "palette"

type HeaderProps = {
  label: string
}

export const Header = ({ label }: HeaderProps) => {
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
      <Text variant="lg" mt={2}>
        {label}
      </Text>
    </Flex>
  )
}
