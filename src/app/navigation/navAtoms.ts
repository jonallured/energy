import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native"
import { atom, useAtom } from "jotai"

const savedNavAtom = atom<{ [key: string]: [name: string, params: object | undefined] }>({})

export function useNavigationSave(key: string): () => void {
  const { name, params } = useRoute()
  const [, setSavedNav] = useAtom(savedNavAtom)
  const saveNav = () => {
    setSavedNav((prev) => ({ ...prev, [key]: [name, params] }))
  }
  return saveNav
}

export function useNavigationSavedForKey(
  key: string
): [hasSavedNav: true, navToSaved: () => void] | [hasSavedNav: false, navToSaved: undefined] {
  const navigation = useNavigation<NavigationProp<any>>()
  const [savedNav] = useAtom(savedNavAtom)

  if (savedNav[key] === undefined) return [false, undefined]

  const navigateToSavedNav = () => {
    const [name, params] = savedNav[key]
    navigation.navigate(name, params)
  }
  return [true, navigateToSavedNav]
}
