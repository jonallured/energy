import { SelectPartnerScreen } from "Screens/SelectPartner/SelectPartner"
import { GlobalStore } from "store/GlobalStore"
import { Tabs } from "react-native-collapsible-tab-view"
import { Flex, Text } from "palette"
import { TabsContainer } from "Screens/_helpers/TabsContainer"
import { Shows } from "./Shows/Shows"
import { Albums } from "./Albums/Albums"
import { Artists } from "Screens/HomeTabs/Artists/Artists"

const Header = () => (
  <Flex px={2} mt={2}>
    <Text variant="lg">Folio</Text>
  </Flex>
)

export const HomeTabs = () => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  return (
    <TabsContainer header={Header}>
      <Tabs.Tab name="Artists" label="Artists">
        <Artists />
      </Tabs.Tab>
      <Tabs.Tab name="Shows" label="Shows">
        <Shows />
      </Tabs.Tab>
      <Tabs.Tab name="Albums" label="Albums">
        <Albums />
      </Tabs.Tab>
    </TabsContainer>
  )
}
