import { TabsScrollView } from "app/wrappers"
import MasonryList from "@react-native-seoul/masonry-list"
import { ArtworkImageGridItem } from "app/sharedUI/items/ArtworkImageGridItem"
import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ListEmptyComponent } from "app/sharedUI"
import { useSpace } from "palette"

export const ShowInstalls = ({ slug }: { slug: string }) => {
  const installsData = useLazyLoadQuery<ShowInstallsQuery>(showInstallsQuery, { slug })
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
          return <ArtworkImageGridItem url={showInstall.url} />
        }}
        keyExtractor={(item) => item.internalID!}
        ListEmptyComponent={<ListEmptyComponent />}
      />
    </TabsScrollView>
  )
}

const showInstallsQuery = graphql`
  query ShowInstallsQuery($slug: String!) {
    show(id: $slug) {
      images {
        internalID
        url
      }
    }
  }
`
