import { Text } from "palette"
import { TabsFlatList } from "helpers/components/TabsTestWrappers"

export const Shows = () => <TabsFlatList data={[0]} renderItem={() => <Text>Shows</Text>} />
