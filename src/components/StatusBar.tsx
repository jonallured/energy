import { Flex, Separator, useColor } from "@artsy/palette-mobile"
import { FadeIn } from "components/Animations/FadeIn"
import { AnimatePresence } from "moti"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GlobalStore } from "system/store/GlobalStore"

interface StatusBarProps {
  backgroundColor?: string
}

export const StatusBar: React.FC<StatusBarProps> = ({ backgroundColor }) => {
  const isPresentationMode = GlobalStore.useAppState(
    (state) => state.presentationMode.isPresentationModeEnabled
  )
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
      {!!isStaging && (
        <Flex top={saInsets.top}>
          <Separator border={colors("devpurple")} />
        </Flex>
      )}

      <AnimatePresence>
        {!!isPresentationMode && (
          <FadeIn initialScale={1}>
            <Flex top={saInsets.top}>
              <Separator border={colors("brand")} />
            </Flex>
          </FadeIn>
        )}
      </AnimatePresence>
    </Flex>
  )
}
