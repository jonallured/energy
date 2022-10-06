import { ScrollView } from "react-native"
import { StyleSheet, View } from "react-native"
import { Header } from "app/sharedUI"

import { Flex, Text } from "palette"

import * as IconsObject from "palette/svgs"

const styles = StyleSheet.create({
  contentContainer: { alignItems: "flex-start", paddingLeft: 30 },
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  iconName: {
    marginLeft: 5,
  },
})

export const InsteadOfStorybook = () => {
  const allIcons = Object.entries(IconsObject)

  return (
    <ScrollView>
      <Flex style={styles.contentContainer}>
        {allIcons.map((icon) => {
          const Icon = icon[1]
          const iconName = icon[0]
          return (
            <View style={styles.container} key={iconName}>
              <Icon fill="onBackground" />
              <Text style={styles.iconName}>{iconName}</Text>
            </View>
          )
        })}
      </Flex>
      <Header label="Instead of Storybook" safeAreaInsets />
      <Header label="lalal" withoutBackButton />
      <Header label="Lets add our button variations here" withoutBackButton />
    </ScrollView>
  )
}
