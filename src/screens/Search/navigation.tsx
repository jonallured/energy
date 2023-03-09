import { StackNav } from "Navigation"
import { Search } from "screens/Search/Search"

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
