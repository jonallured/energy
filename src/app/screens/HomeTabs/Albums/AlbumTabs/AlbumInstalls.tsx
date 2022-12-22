import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { ArtworkImageGridItem } from "app/components/Items/ArtworkImageGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsScrollView } from "app/components/Tabs/TabsContent"

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
        keyExtractor={(item: any, index: any) => item ?? `${index}`}
        renderItem={({ item: url }) => <ArtworkImageGridItem url={url} />}
        ListEmptyComponent={<ListEmptyComponent text="No installs shots to display" />}
      />
    </TabsScrollView>
  )
}
