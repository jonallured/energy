import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistsList } from "components/Lists/ArtistsList"
import { useRouter } from "system/hooks/useRouter"
import { useTrackScreen } from "system/hooks/useTrackScreen"

export const ArtistsTab: React.FC = () => {
  useTrackScreen({ name: "Artists", type: "Artists" })

  const { router } = useRouter()

  const handleItemPress = (item: ArtistListItem_artist$data) => {
    router.navigate("ArtistTabs", {
      slug: item.slug,
      name: item.name as string,
    })
  }

  return <ArtistsList onItemPress={handleItemPress} isInTabs />
}
