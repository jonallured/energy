import { MasonryList } from "@react-native-seoul/masonry-list"
import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { ArtworkImageGridItem } from "app/components/Items/ArtworkImageGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { Portal } from "app/components/Portal"
import { isAllSelected, isSelected, SelectMode } from "app/components/SelectMode"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItemInstall } from "app/system/store/Models/SelectModeModel"
import { getContentContainerStyle } from "app/utils/getContentContainerStyle"
import { imageSize } from "app/utils/imageSize"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { graphql } from "react-relay"

export const ShowInstalls = ({ slug }: { slug: string }) => {
  const installsData = useSystemQueryLoader<ShowInstallsQuery>(showInstallsQuery, {
    slug,
    imageSize,
  })

  const installs = (installsData.show?.images ?? []) as SelectedItemInstall[]

  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const activeTab = useFocusedTab()
  const allSelected = isAllSelected(selectedItems, installs)

  return (
    <>
      <Portal active={activeTab === "ShowInstalls"}>
        <SelectMode
          allSelected={allSelected}
          selectAll={() => {
            GlobalStore.actions.selectMode.selectItems(installs)
          }}
          unselectAll={() => {
            GlobalStore.actions.selectMode.clearSelectedItems()
          }}
        />
      </Portal>

      <TabsScrollView>
        <MasonryList
          testID="show-installs-list"
          contentContainerStyle={getContentContainerStyle(installs)}
          numColumns={2}
          data={installs}
          keyExtractor={(item: any, index: any) => item?.internalID ?? `${index}`}
          renderItem={({ item: showInstall }) => (
            <ArtworkImageGridItem
              url={showInstall?.resized?.url ?? ""}
              onPress={() => GlobalStore.actions.selectMode.toggleSelectedItem(showInstall)}
              selectedToAdd={isSelected(selectedItems, showInstall)}
            />
          )}
          ListEmptyComponent={<ListEmptyComponent text="No show installs shots to display" />}
        />
      </TabsScrollView>
    </>
  )
}

export const showInstallsQuery = graphql`
  query ShowInstallsQuery($slug: String!, $imageSize: Int!) {
    show(id: $slug) {
      images(default: true) {
        __typename
        internalID
        resized(width: $imageSize, version: "normalized") {
          height
          url
        }
      }
    }
  }
`
