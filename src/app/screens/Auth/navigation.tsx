import { StackNav } from "app/Navigation"
import { LoginScreen } from "app/screens/Auth/Login"
import { SelectPartnerScreen } from "app/screens/Auth/SelectPartner"

export type AuthNavigationScreens = {
  Login: undefined
  SelectPartner: undefined
}

export const AuthNavigation: React.FC<{ isLoggedIn: boolean; selectedPartner: string | null }> = ({
  isLoggedIn,
  selectedPartner,
}) => {
  if (!isLoggedIn) {
    return (
      <StackNav.Group>
        <StackNav.Screen name="Login" component={LoginScreen} />
      </StackNav.Group>
    )
  }

  if (selectedPartner === null) {
    return (
      <StackNav.Group>
        <StackNav.Screen name="SelectPartner" component={SelectPartnerScreen} />
      </StackNav.Group>
    )
  }

  return null
}