import { useNavigation } from "@react-navigation/native"
import { Flex, Touchable, ArrowLeftIcon } from "palette"

export const BackButton = () => {
  const navigation = useNavigation()

  return (
    <Flex my={2}>
      <Touchable
        onPress={() => {
          navigation.goBack()
        }}
      >
        <ArrowLeftIcon fill="black100" />
      </Touchable>
    </Flex>
  )
}
