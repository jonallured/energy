import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
import { GlobalStore } from "system/store/GlobalStore"

export function useSaveNavigationHistory() {
  const { name, params } = useRoute()

  const saveNavigationHistory = (lookupKey: string) => {
    GlobalStore.actions.system.saveNavigationHistory({
      lookupKey,
      navigationState: [name, params],
    })
  }

  return {
    saveNavigationHistory,
  }
}

interface NavigateToSavedHistoryProps {
  lookupKey: string
  onComplete?: () => void
}

export function useNavigateToSavedHistory() {
  const navigation = useNavigation<NavigationProp<any>>()
  const navigationHistory = GlobalStore.useAppState(
    (state) => state.system.sessionState.navigationHistory
  )

  const navigateToSavedHistory = ({
    lookupKey,
    onComplete,
  }: NavigateToSavedHistoryProps) => {
    if (!navigationHistory[lookupKey]) {
      navigation.goBack()
      onComplete?.()
      return
    }

    const [name, params] = navigationHistory[lookupKey]

    GlobalStore.actions.system.deleteNavigationHistory(lookupKey)
    navigation.navigate(name, params)
    onComplete?.()
  }

  return {
    navigateToSavedHistory,
  }
}
