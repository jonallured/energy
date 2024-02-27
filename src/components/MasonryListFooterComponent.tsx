import { Flex } from "@artsy/palette-mobile/dist/elements/Flex"
import { ActivityIndicator } from "react-native"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

interface MasonryListFooterComponentProps {
  shouldDisplaySpinner: boolean
}

export const MasonryListFooterComponent: React.FC<
  MasonryListFooterComponentProps
> = ({ shouldDisplaySpinner }) => {
  const isDarkMode = useIsDarkMode()

  if (!shouldDisplaySpinner) {
    return null
  }

  return (
    <Flex width="100%" position="absolute">
      <Flex mt={2}>
        <ActivityIndicator color={isDarkMode ? "white" : "black"} />
      </Flex>
    </Flex>
  )
}
