import { ViewProps , Pressable, View, ViewStyle } from "react-native"
import { Text, useColor } from "palette"

export interface TabV3Props {
  label: string
  superscript?: string
  active: boolean
  style?: ViewStyle
  onPress: () => void
  onLayout: ViewProps["onLayout"]
}

export const TabV3: React.FC<TabV3Props> = ({
  label,
  superscript,
  active,
  onLayout,
  onPress,
  style,
}) => {
  const color = useColor()
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          onLayout={onLayout}
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
            flexDirection: "row",
            ...style,
          }}
        >
          <Text
            fontSize={16}
            color={
              active
                ? color("onBackground")
                : pressed
                ? color("blue100")
                : color("onBackgroundMedium")
            }
            style={{
              textDecorationLine: pressed ? "underline" : "none",
            }}
          >
            {label}
          </Text>
          {!!superscript && (
            <Text
              fontSize={12}
              color={color("blue100")}
              style={{
                textDecorationLine: pressed ? "underline" : "none",
                top: -3,
              }}
            >
              {superscript}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  )
}
