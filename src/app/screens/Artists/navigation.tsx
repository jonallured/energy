import { StackNav } from "app/Navigation"
import { ArtistTabs } from "app/screens/Artists/ArtistTabs/ArtistTabs"

export type ArtistNavigationScreens = {
  ArtistTabs: { slug: string; name: string }
}

export const ArtistNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="ArtistTabs" component={ArtistTabs} />
    </StackNav.Group>
  )
}
