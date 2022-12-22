import { StackNav } from "app/Navigation"
import { ShowTabs } from "app/screens/Shows/ShowTabs/ShowTabs"

export type ShowsNavigationScreens = {
  ShowTabs: { slug: string }
}

export const ShowsNavigation = () => {
  return (
    <>
      <StackNav.Screen name="ShowTabs" component={ShowTabs} />
    </>
  )
}
