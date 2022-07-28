import { TabsScrollView } from "app/wrappers"
import MasonryList from "@react-native-seoul/masonry-list"
import { ArtworkImageGridItem } from "app/sharedUI/items/ArtworkImageGridItem"
import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ListEmptyComponent } from "app/sharedUI"
import { useSpace } from "palette"
import { Dimensions } from "react-native"

export const ShowInstalls = ({ slug }: { slug: string }) => {
  const windowWidth = Number(Dimensions.get("window").width)
  const installsData = useLazyLoadQuery<ShowInstallsQuery>(showInstallsQuery, {
    slug,
    imageSize: 2 * windowWidth,
  })

  let installs = installsData.show?.images ?? []

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
        renderItem={({ item: showInstall }) => {
          return <ArtworkImageGridItem url={showInstall.resized.url} />
        }}
        keyExtractor={(item) => item.internalID!}
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
        resized(height: $imageSize, version: "normalized") {
          url
        }
      }
    }
  }
`
