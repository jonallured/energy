import { AnimatePresence, MotiView } from "moti"
import { Easing } from "react-native-reanimated"

interface AnimationProps {
  visible?: boolean
}

export const SlideUpFromBottom: React.FC<AnimationProps> = ({ children, visible = true }) => {
  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          from={{ opacity: 0, translateY: 400 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{
            opacity: 0,
            translateY: 400,
          }}
          transition={{
            type: "timing",
            duration: 400,

            translateY: {
              type: "timing",
              easing: Easing.out(Easing.exp),
            },
          }}
          exitTransition={{
            type: "timing",
            duration: 200,

            translateY: {
              type: "timing",
              easing: Easing.in(Easing.exp),
            },
          }}
        >
          {children}
        </MotiView>
      )}
    </AnimatePresence>
  )
}
