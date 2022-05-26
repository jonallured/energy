import { Text } from "palette"
import { TabsFlatList } from "helpers/components/TabsTestWrappers"

export const Works = () => <TabsFlatList data={[0]} renderItem={() => <Text>Works</Text>} />
