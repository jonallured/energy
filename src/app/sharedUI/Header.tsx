import { Flex, Text } from "palette"
import { BackButton } from "./molecules/BackButton"

type HeaderProps = {
  label?: string
  rightElements?: Element
}

export const Header = ({ label, rightElements }: HeaderProps) => {
  return (
    <Flex px={2}>
      <BackButton />
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
        <Flex flex={1}>
          <Text variant="lg">{label}</Text>
        </Flex>
        {rightElements}
      </Flex>
    </Flex>
  )
}
