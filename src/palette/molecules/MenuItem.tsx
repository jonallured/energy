import { StyleProp, ViewStyle } from "react-native"
import { ChevronIcon, Flex, Sans, Touchable, useColor } from "palette"

export const MenuItem: React.FC<{
  disabled?: boolean
  title: React.ReactNode
  value?: React.ReactNode
  text?: string
  onPress?: () => void
  chevron?: React.ReactNode
  style?: StyleProp<ViewStyle>
  rightView?: React.ReactNode
}> = ({
  title,
  text,
  value,
  onPress,
  disabled = false,
  chevron = <ChevronIcon direction="right" fill="onBackgroundMedium" />,
  style,
}) => {
  const color = useColor()
  return (
    <Touchable onPress={onPress} underlayColor={color("black5")} disabled={disabled}>
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        py={2}
        px="2"
        pr="15px"
      >
        <Flex flexDirection="row" mr="2">
          <Sans size="4">{title}</Sans>
        </Flex>
        {!!value && (
          <Flex flex={1}>
            <Sans size="4" color="onBackgroundMedium" numberOfLines={1} textAlign="right">
              {value}
            </Sans>
          </Flex>
        )}
        {!!(onPress && chevron) && <Flex ml="1">{chevron}</Flex>}

        {!!text && (
          <Sans size="4" color={color("onBackgroundMedium")}>
            {text}
          </Sans>
        )}
      </Flex>
    </Touchable>
  )
}
