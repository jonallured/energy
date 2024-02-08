import { Button, Flex, Text } from "@artsy/palette-mobile"
import { useRouter } from "system/hooks/useRouter"

interface ErrorViewProps {
  error?: Error
  withoutBackButton?: boolean
}

export const ErrorView = ({
  error,
  withoutBackButton = false,
}: ErrorViewProps) => {
  const { router } = useRouter()

  return (
    <Flex flex={1} m={4} justifyContent="center" alignItems="center">
      {!withoutBackButton && (
        <Button variant="outline" block onPress={() => router.goBack()}>
          Back
        </Button>
      )}
      <Flex my={2}>
        <Text>Error: {error?.message}</Text>
      </Flex>
    </Flex>
  )
}
