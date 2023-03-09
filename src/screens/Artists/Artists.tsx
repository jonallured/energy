import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistsList } from "components/Lists/ArtistsList"

export const Artists: React.FC = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()

  const handleItemPress = (item: ArtistListItem_artist$data) => {
    navigation.navigate("ArtistTabs", {
      slug: item.slug,
      name: item.name as string,
    })
  }

  return <ArtistsList onItemPress={handleItemPress} />
}
