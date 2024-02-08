import { useRoute } from "@react-navigation/native"
import { useRouter } from "system/hooks/useRouter"
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
  const { router } = useRouter()
  const navigationHistory = GlobalStore.useAppState(
    (state) => state.system.sessionState.navigationHistory
  )

  const navigateToSavedHistory = ({
    lookupKey,
    onComplete,
  }: NavigateToSavedHistoryProps) => {
    if (!navigationHistory[lookupKey]) {
      router.goBack()
      onComplete?.()
      return
    }

    const [name, params] = navigationHistory[lookupKey] as any

    GlobalStore.actions.system.deleteNavigationHistory(lookupKey)
    router.navigate(name, params)
    onComplete?.()
  }

  return {
    navigateToSavedHistory,
  }
}
