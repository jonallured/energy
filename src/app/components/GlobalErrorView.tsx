import { Flex } from "@artsy/palette-mobile"
import { Text } from "react-native"

interface GlobalErrorViewProps {
  error: Error
}

export const GlobalErrorView = ({ error }: GlobalErrorViewProps) => {
  return (
    <Flex flex={1} justifyContent="center" alignItems="center">
      <Text>Error: {error?.message}</Text>
    </Flex>
  )
}
