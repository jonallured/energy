import { Flex, useColor } from "@artsy/palette-mobile"
import { SCREEN_HORIZONTAL_PADDING } from "components/Screen/constants"
import LinearGradient from "react-native-linear-gradient"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

export const BottomView: React.FC = ({ children }) => {
  const color = useColor()
  const isDarkMode = useIsDarkMode()

  return (
    <>
      <LinearGradient
        colors={[isDarkMode ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)", color("background")]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          width: "100%",
          height: 20,
        }}
        pointerEvents="none"
      />
      <Flex px={SCREEN_HORIZONTAL_PADDING} pt={1} pb={1} backgroundColor="background">
        {children}
      </Flex>
    </>
  )
}
