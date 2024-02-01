import { Button, Flex, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"

interface ErrorViewProps {
  error?: Error
  withoutBackButton?: boolean
}

export const ErrorView = ({
  error,
  withoutBackButton = false,
}: ErrorViewProps) => {
  const navigation = useNavigation()

  return (
    <Flex flex={1} m={4} justifyContent="center" alignItems="center">
      {!withoutBackButton && (
        <Button variant="outline" block onPress={() => navigation.goBack()}>
          Back
        </Button>
      )}
      <Flex my={2}>
        <Text>Error: {error?.message}</Text>
      </Flex>
    </Flex>
  )
}
