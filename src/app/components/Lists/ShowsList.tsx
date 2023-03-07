import { Touchable } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "app/Navigation"
import { ShowListItem } from "app/components/Items/ShowListItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsFlatList } from "app/components/Tabs/TabsContent"
import { GlobalStore } from "app/system/store/GlobalStore"
import { getContentContainerStyle } from "app/utils/getContentContainerStyle"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"

interface ShowsListProps {
  shows: any[]
}

export const ShowsList: React.FC<ShowsListProps> = ({ shows }) => {
  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const screenWidth = useWindowDimensions().width
  const margin = 20

  return (
    <TabsFlatList
      columnWrapperStyle={
        isTablet() ? { justifyContent: "space-between", alignItems: "flex-start" } : null
      }
      contentContainerStyle={getContentContainerStyle(shows)}
      data={shows}
      numColumns={isTablet() ? 2 : 1}
      renderItem={({ item }) => (
        <Touchable
          onPress={() =>
            navigation.navigate("ShowTabs", {
              slug: item.slug,
            })
          }
          style={{ width: isTablet() ? (screenWidth - margin * 3) / 2 : undefined }}
          disabled={isSelectModeActive}
        >
          <ShowListItem show={item} disabled={isSelectModeActive} />
        </Touchable>
      )}
      keyExtractor={(item) => item?.internalID}
      ListEmptyComponent={<ListEmptyComponent text="No shows" />}
    />
  )
}
