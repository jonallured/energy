import { useNavigation } from "@react-navigation/native"
import { Flex, Text, Touchable, ArrowLeftIcon } from "palette"

type HeaderProps = {
  label: string
  withoutBackButton?: boolean
  rightElements?: Element
}

export const Header = ({ label, withoutBackButton, rightElements }: HeaderProps) => {
  const navigation = useNavigation()
  return (
    <Flex px={2}>
      {!withoutBackButton ? (
        <Flex mt={2}>
          <Touchable
            onPress={() => {
              navigation.goBack()
            }}
          >
            <ArrowLeftIcon fill="black100" />
          </Touchable>
        </Flex>
      ) : null}
      <Flex flexDirection="row" mt={2} alignItems="center" justifyContent="space-between">
        <Text variant="lg">{label}</Text>
        <Flex>{rightElements}</Flex>
      </Flex>
    </Flex>
  )
}
