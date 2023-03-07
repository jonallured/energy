import {
  DEFAULT_HIT_SLOP,
  Flex,
  Input,
  MagnifyingGlassIcon,
  Separator,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "app/Navigation"
import { useAtom } from "jotai"
import { throttle } from "lodash"
import { Screen } from "palette"
import { useEffect, useMemo, useRef, useState } from "react"
import { SearchPills } from "./SearchPills"
import { SearchResult } from "./SearchResult"
import { disabledPillsAtom, selectedPillAtom } from "./searchAtoms"

const SEARCH_THROTTLE_INTERVAL = 1000
const MINIMUM_SEARCH_INPUT_LENGTH = 2

export const Search = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const [inputText, setInputText] = useState("")
  const [search, setSearch] = useState("")
  const searchInputRef = useRef<Input>(null)
  const [, setSelectedPill] = useAtom(selectedPillAtom)
  const [, setDisabledPills] = useAtom(disabledPillsAtom)

  useEffect(() => {
    if (inputText.length < MINIMUM_SEARCH_INPUT_LENGTH) {
      setSelectedPill(null)
      setDisabledPills([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText])

  useEffect(() => {
    if (searchInputRef.current) {
      const unsubscribe = navigation.addListener("focus", () => {
        searchInputRef.current?.focus()
      })
      return unsubscribe
    }
  }, [navigation])

  const handleChangeText = (text: string) => {
    setInputText(text)
    setSelectedPill("All")
    handleSearch(text)
  }

  const handleSearch = useMemo(
    () =>
      throttle((searchInput: string) => {
        if (searchInput.length >= MINIMUM_SEARCH_INPUT_LENGTH) {
          setSearch(searchInput)
        }
      }, SEARCH_THROTTLE_INTERVAL),
    []
  )

  return (
    <Screen>
      <Screen.RawHeader>
        <Flex mx={2}>
          <Flex flexDirection="row" alignItems="center">
            <Input
              ref={searchInputRef}
              style={{ borderWidth: 0 }}
              icon={<MagnifyingGlassIcon />}
              onChangeText={(text) => handleChangeText(text.trim())}
              value={inputText}
              focusable
              placeholder="Search"
              enableClearButton
            />
            <Touchable onPress={() => navigation.goBack()} hitSlop={DEFAULT_HIT_SLOP}>
              <Text variant="xs">Cancel</Text>
            </Touchable>
          </Flex>
          <Separator />
        </Flex>
      </Screen.RawHeader>
      <Screen.Body nosafe fullwidth>
        <Spacer y={2} />
        <SearchPills />
        <Spacer y={1} />
        {inputText.length >= MINIMUM_SEARCH_INPUT_LENGTH && <SearchResult searchInput={search} />}
      </Screen.Body>
    </Screen>
  )
}
