import { Flex, useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { isEqual } from "lodash"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { ListEmptyComponent } from "app/sharedUI"
import { ArtworkImageGridItem } from "app/sharedUI/items/ArtworkImageGridItem"
import { GlobalStore } from "app/store/GlobalStore"
import { useHeaderSelectModeInTab } from "app/store/selectModeAtoms"
import { imageSize } from "app/utils/imageSize"
import { TabsScrollView } from "app/wrappers"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"

export const ShowInstalls = ({ slug }: { slug: string }) => {
  const installsData = useLazyLoadQuery<ShowInstallsQuery>(showInstallsQuery, {
    slug,
    imageSize,
  })

  const installs = installsData.show?.images ?? []
  const space = useSpace()

  const selectedInstalls = GlobalStore.useAppState((state) => state.selectMode.installs)
  useHeaderSelectModeInTab("ShowInstalls", {
    allSelected: isEqual(new Set(selectedInstalls), new Set(installs.map((i) => i!.resized?.url))),
    selectAllFn: () =>
      void GlobalStore.actions.selectMode.setSelectedItems({
        type: "install",
        items: installs.map((i) => i!.resized!.url),
      }),
    unselectAllFn: () =>
      void GlobalStore.actions.selectMode.setSelectedItems({ type: "install", items: [] }),
  })

  return (
    <TabsScrollView>
      <MasonryList
        testID="show-installs-list"
        contentContainerStyle={{
          marginTop: space(2),
          paddingRight: space(2),
        }}
        numColumns={2}
        data={installs}
        keyExtractor={(item, index) => item?.internalID ?? `${index}`}
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
        ListEmptyComponent={
          <Flex mx={SCREEN_HORIZONTAL_PADDING}>
            <ListEmptyComponent text="No show installs shots to display" />
          </Flex>
        }
      />
    </TabsScrollView>
  )
}

const showInstallsQuery = graphql`
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
