import { Flex, Text } from "@artsy/palette-mobile"

interface ArtworkDetailProps {
  size?: "big" | "small"
  label: string
  value: string | null | undefined
}

export const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ size = "big", label, value }) => {
  if (!value) {
    return null
  }

  return (
    <Flex px={1} py={0.5}>
      <Text variant={size === "big" ? "sm" : "xs"}>{label}</Text>
      <Text variant={size === "big" ? "sm" : "xs"} color="onBackgroundMedium">
        {value}
      </Text>
    </Flex>
  )
}

export const ArtworkDetailLineItem: React.FC<Pick<ArtworkDetailProps, "value">> = ({ value }) => {
  if (!value) {
    return null
  }

  return (
    <Text variant="sm" color="onBackgroundMedium">
      {value}
    </Text>
  )
}
