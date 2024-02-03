import { Tabs } from "@artsy/palette-mobile"
import { ShowListItem } from "components/Items/ShowListItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { isTablet } from "react-native-device-info"

interface ShowsListProps {
  shows: any[]
  refreshControl?: JSX.Element
}

export const ShowsList: React.FC<ShowsListProps> = ({
  shows,
  refreshControl,
}) => {
  return (
    <Tabs.FlatList
      columnWrapperStyle={
        isTablet()
          ? { justifyContent: "space-between", alignItems: "flex-start" }
          : null
      }
      data={shows}
      maxToRenderPerBatch={20}
      initialNumToRender={20}
      numColumns={isTablet() ? 2 : 1}
      renderItem={({ item }) => <ShowListItem show={item} />}
      keyExtractor={(item) => item?.internalID}
      ListEmptyComponent={<ListEmptyComponent text="No shows" />}
      refreshControl={refreshControl}
    />
  )
}
