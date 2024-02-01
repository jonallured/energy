import { Tabs, Touchable } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ShowListItem } from "components/Items/ShowListItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { GlobalStore } from "system/store/GlobalStore"

interface ShowsListProps {
  shows: any[]
  refreshControl?: JSX.Element
}

export const ShowsList: React.FC<ShowsListProps> = ({
  shows,
  refreshControl,
}) => {
  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const screenWidth = useWindowDimensions().width
  const margin = 20

  return (
    <Tabs.FlatList
      columnWrapperStyle={
        isTablet()
          ? { justifyContent: "space-between", alignItems: "flex-start" }
          : null
      }
      data={shows}
      numColumns={isTablet() ? 2 : 1}
      renderItem={({ item }) => (
        <Touchable
          onPress={() =>
            navigation.navigate("ShowTabs", {
              slug: item.slug,
            })
          }
          style={{
            width: isTablet() ? (screenWidth - margin * 3) / 2 : undefined,
          }}
          disabled={isSelectModeActive}
        >
          <ShowListItem show={item} disabled={isSelectModeActive} />
        </Touchable>
      )}
      keyExtractor={(item) => item?.internalID}
      ListEmptyComponent={<ListEmptyComponent text="No shows" />}
      refreshControl={refreshControl}
    />
  )
}
