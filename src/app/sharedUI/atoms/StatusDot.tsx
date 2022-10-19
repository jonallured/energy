import { Flex } from "@artsy/palette-mobile"

interface AvailabilityDotProps {
  availability?: string | null
}

export const AvailabilityDot = ({ availability }: AvailabilityDotProps) => {
  let color

  switch (availability) {
    case "for sale":
      color = "green100"
      break
    case "on hold":
      color = "orange100"
      break
    case "sold":
      color = "red100"
      break
    default:
      color = "onBackgroundMedium"
  }

  return <Flex height={10} width={10} backgroundColor={color} borderRadius="10" />
}
