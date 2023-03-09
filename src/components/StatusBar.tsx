import { Flex, Separator, useColor } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GlobalStore } from "system/store/GlobalStore"

interface StatusBarProps {
  backgroundColor?: string
}

export const StatusBar = ({ backgroundColor }: StatusBarProps) => {
  const isStaging =
    GlobalStore.useAppState((state) => state.config.environment.activeEnvironment) === "staging"
  const saInsets = useSafeAreaInsets()
  const colors = useColor()

  return (
    <Flex
      position="absolute"
      backgroundColor={backgroundColor}
      left={0}
      right={0}
      top={0}
      height={saInsets.top}
    >
      {isStaging && (
        <Flex top={saInsets.top}>
          <Separator border={colors("devpurple")} />
        </Flex>
      )}
    </Flex>
  )
}
