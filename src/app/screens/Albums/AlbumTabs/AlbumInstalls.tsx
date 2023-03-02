import { MasonryList } from "@react-native-seoul/masonry-list"
import { ArtworkImageGridItem } from "app/components/Items/ArtworkImageGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { getContentContainerStyle } from "app/utils/getContentContainerStyle"

export const AlbumInstalls = ({ installShotUrls }: { installShotUrls: string[] }) => {
  return (
    <TabsScrollView>
      <MasonryList
        contentContainerStyle={getContentContainerStyle(installShotUrls)}
        numColumns={2}
        data={installShotUrls}
        keyExtractor={(item, index) => item ?? `${index}`}
        renderItem={({ item: url }) => <ArtworkImageGridItem url={url} />}
        ListEmptyComponent={<ListEmptyComponent text="No installs shots to display" />}
      />
    </TabsScrollView>
  )
}
