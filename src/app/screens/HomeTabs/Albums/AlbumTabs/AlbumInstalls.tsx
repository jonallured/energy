import { Flex, useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { ListEmptyComponent } from "app/sharedUI"
import { ArtworkImageGridItem } from "app/sharedUI/items/ArtworkImageGridItem"
import { TabsScrollView } from "app/wrappers"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"

export const AlbumInstalls = ({ installShotUrls }: { installShotUrls: string[] }) => {
  const space = useSpace()

  return (
    <TabsScrollView>
      <MasonryList
        contentContainerStyle={{
          marginTop: space(2),
          paddingRight: space(2),
        }}
        numColumns={2}
        data={installShotUrls}
        keyExtractor={(item, index) => item ?? `${index}`}
        renderItem={({ item: url }) => <ArtworkImageGridItem url={url ?? ""} />}
        ListEmptyComponent={
          <Flex mx={SCREEN_HORIZONTAL_PADDING}>
            <ListEmptyComponent text="No installs shots to display" />
          </Flex>
        }
      />
    </TabsScrollView>
  )
}
