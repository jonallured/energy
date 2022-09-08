import { ScrollView } from "react-native"
import { Header } from "app/sharedUI"

export const InsteadOfStorybook = () => {
  return (
    <ScrollView>
      <Header label="Instead of Storybook" safeAreaInsets />
      <Header label="lalal" withoutBackButton />
      <Header label="Lets add our button variations here" withoutBackButton />
    </ScrollView>
  )
}
