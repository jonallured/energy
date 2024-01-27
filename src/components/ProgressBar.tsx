import { Color, Flex, useColor } from "@artsy/palette-mobile"
import { MotiView } from "moti"
import { useEffect, useState } from "react"

export interface ProgressBarProps {
  duration?: number
  backgroundColor?: Color
  height?: number
  onComplete?: () => void
  progress: number
  trackColor?: Color
}

export const ProgressBar = ({
  duration = 200,
  backgroundColor = "black30",
  height = 2,
  onComplete,
  progress,
  trackColor = "blue100",
}: ProgressBarProps) => {
  const color = useColor()

  const [onCompletionCalled, setOnCompletionCalled] = useState(false)

  useEffect(() => {
    if (progress === 100 && !onCompletionCalled) {
      onComplete?.()
      setOnCompletionCalled(true)
    }
  }, [progress])

  return (
    <Flex width="100%" backgroundColor={backgroundColor} my={1}>
      <MotiView
        from={{ width: 0 }}
        animate={{ width: progress + "%" }}
        transition={{ duration }}
        style={{ height, backgroundColor: color(trackColor) }}
      />
    </Flex>
  )
}
