import { Flex } from "palette"

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
      color = "black60"
  }

  return <Flex height={10} width={10} backgroundColor={color} borderRadius="10" />
}
