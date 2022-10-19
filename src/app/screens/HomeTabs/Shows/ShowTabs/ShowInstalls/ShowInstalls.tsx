import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { ListEmptyComponent } from "app/sharedUI"
import { ArtworkImageGridItem } from "app/sharedUI/items/ArtworkImageGridItem"
import { imageSize } from "app/utils/imageSize"
import { TabsScrollView } from "app/wrappers"

export const ShowInstalls = ({ slug }: { slug: string }) => {
  const installsData = useLazyLoadQuery<ShowInstallsQuery>(showInstallsQuery, {
    slug,
    imageSize,
  })

  const installs = installsData.show?.images ?? []
  const space = useSpace()

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
          <ArtworkImageGridItem url={showInstall?.resized?.url ?? ""} />
        )}
        ListEmptyComponent={<ListEmptyComponent text="No show installs shots to display" />}
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
          url
        }
      }
    }
  }
`
