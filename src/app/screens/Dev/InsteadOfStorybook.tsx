import { Button, Flex, Text } from "@artsy/palette-mobile"
import * as IconsObject from "@artsy/palette-mobile/dist/svgs"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "app/Navigation"
import { Screen } from "palette"

export const InsteadOfStorybook = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const allIcons = Object.entries(IconsObject)

  return (
    <Screen>
      <Screen.Header title="Instead of Storybook" />
      <Screen.Body scroll>
        <Button onPress={() => navigation.navigate("StorybookScreenAnimatedTitleHeaderTabs")}>
          Animated Title Header with Tabs
        </Button>
        <Button onPress={() => navigation.navigate("StorybookScreenAnimatedTitleHeader")}>
          Animated Title Header without Tabs
        </Button>
        <Button onPress={() => navigation.navigate("StorybookScreenHeader")}>
          Header (home screen)
        </Button>
        <Button onPress={() => navigation.navigate("StorybookScreenFullWidthItem")}>
          Full screen item (trove)
        </Button>
        <Button onPress={() => navigation.navigate("StorybookScreenHeaderElements")}>
          Header with elements (artist screen)
        </Button>
        <Button onPress={() => navigation.navigate("StorybookScreenBottomView")}>
          Bottom View (purchase screen)
        </Button>
        <Button onPress={() => navigation.navigate("StorybookScreenRawHeader")}>
          RawHeader (put anything you like in the header)
        </Button>

        {allIcons.map((icon) => {
          const Icon = icon[1]
          const iconName = icon[0]
          return (
            <Flex flexDirection="row" alignItems="center" key={iconName}>
              <Icon fill="onBackground" />
              <Text ml={5}>{iconName}</Text>
            </Flex>
          )
        })}
      </Screen.Body>
    </Screen>
  )
}
