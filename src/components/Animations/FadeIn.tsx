import { MotiView } from "moti"

interface FadeInProps {
  initialScale?: number
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  initialScale = 0.9,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: initialScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 200 }}
      exit={{ opacity: 0, scale: initialScale }}
    >
      {children}
    </MotiView>
  )
}
