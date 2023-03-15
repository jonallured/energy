import { StackNav } from "Navigation"
import { SearchScreen } from "screens/Search/Search"

export type SearchNavigationScreens = {
  Search: undefined
}

export const SearchNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Search" component={SearchScreen} />
    </StackNav.Group>
  )
}
