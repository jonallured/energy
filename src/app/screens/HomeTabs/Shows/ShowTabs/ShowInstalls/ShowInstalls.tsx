import { TabsFlatList } from "app/wrappers"
import { Text } from "palette"

export const ShowInstalls = () => {
  return (
    <TabsFlatList
      data={[1, 2, 3, 4, 5]}
      renderItem={({ item }) => <Text>Show installs {item}</Text>}
    />
  )
}
