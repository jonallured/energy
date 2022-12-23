import { StackNav } from "app/Navigation"
import { Search } from "app/screens/Search/Search"

export type SearchNavigationScreens = {
  Search: undefined
}

export const SearchNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Search" component={Search} />
    </StackNav.Group>
  )
}
