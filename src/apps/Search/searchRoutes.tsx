import { StackNav } from "Navigation"
import { SearchScreen } from "apps/Search/routes/Search/Search"

export type SearchRoutes = {
  Search: undefined
}

export const SearchRouter = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Search" component={SearchScreen} />
    </StackNav.Group>
  )
}
