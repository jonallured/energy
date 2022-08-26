import { Header } from "app/sharedUI"
import { ScrollView } from "react-native"

export const InsteadOfStorybook = () => {
  return (
    <ScrollView>
      <Header label="Instead of Storybook" safeAreaInsets />
      <Header label="lalal" withoutBackButton />
      <Header label="Lets add our button variations here" withoutBackButton />
    </ScrollView>
  )
}
