import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationRoutes } from "Navigation"

export const useRouter = () => {
  const router = useNavigation<NavigationProp<NavigationRoutes>>()

  return {
    router,
  }
}
