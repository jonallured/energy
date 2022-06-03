import { Text } from "react-native"
import { TabsFlatList } from "Screens/_helpers/TabsTestWrappers"

export const ArtistShows = () => {
  return (
    <TabsFlatList
      data={[1, 2, 3, 4, 5]}
      renderItem={({ item }) => <Text>ArtistShows {item}</Text>}
    />
  )
}
