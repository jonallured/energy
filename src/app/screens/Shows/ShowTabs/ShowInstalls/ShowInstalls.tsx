import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { isEqual } from "lodash"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { graphql } from "react-relay"
import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { ArtworkImageGridItem } from "app/components/Items/ArtworkImageGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { Portal } from "app/components/Portal"
import { SelectMode } from "app/components/SelectMode"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { imageSize } from "app/utils/imageSize"

export const ShowInstalls = ({ slug }: { slug: string }) => {
  const installsData = useSystemQueryLoader<ShowInstallsQuery>(showInstallsQuery, {
    slug,
    imageSize,
  })

  const installs = installsData.show?.images ?? []
  const space = useSpace()

  const selectedInstalls = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.installs
  )

  const activeTab = useFocusedTab()

  const allSelected = isEqual(
    new Set(selectedInstalls),
    new Set(installs.map((i) => i!.resized?.url))
  )

  return (
    <>
      <Portal active={activeTab === "ShowInstalls"}>
        <SelectMode
          allSelected={allSelected}
          selectAll={() => {
            GlobalStore.actions.selectMode.setSelectedItems({
              type: "install",
              items: installs.map((i) => i!.resized!.url),
            })
          }}
          unselectAll={() => {
            GlobalStore.actions.selectMode.setSelectedItems({ type: "install", items: [] })
          }}
        />
      </Portal>

      <TabsScrollView>
        <MasonryList
          testID="show-installs-list"
          contentContainerStyle={{
            marginTop: space(2),
            paddingHorizontal: space(2),
          }}
          numColumns={2}
          data={installs}
          keyExtractor={(item: any, index: any) => item?.internalID ?? `${index}`}
          renderItem={({ item: showInstall }) => (
            <ArtworkImageGridItem
              url={showInstall?.resized?.url ?? ""}
              onPress={() =>
                void GlobalStore.actions.selectMode.toggleSelectedItem({
                  type: "install",
                  item: showInstall!.resized!.url,
                })
              }
              selectedToAdd={selectedInstalls.includes(showInstall!.resized!.url)}
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
        internalID
        resized(width: $imageSize, version: "normalized") {
          height
          url
        }
      }
    }
  }
`
