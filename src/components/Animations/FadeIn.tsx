import { MotiView } from "moti"

export const FadeIn: React.FC = ({ children }) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 200 }}
    >
      {children}
    </MotiView>
  )
}
