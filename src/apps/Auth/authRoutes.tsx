import { StackNav } from "Navigation"
import { LoginScreen } from "apps/Auth/routes/Login"
import { SelectPartnerScreen } from "apps/Auth/routes/SelectPartner"

export type AuthRoutes = {
  Login: undefined
  SelectPartner: undefined
}

export const AuthRouter: React.FC<{
  isLoggedIn: boolean
  selectedPartner: string | null
}> = ({ isLoggedIn, selectedPartner }) => {
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
