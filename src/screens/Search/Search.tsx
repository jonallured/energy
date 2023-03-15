import {
  DEFAULT_HIT_SLOP,
  Flex,
  Input,
  MagnifyingGlassIcon,
  Separator,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { Screen } from "components/Screen"
import { throttle } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import { SearchContext } from "screens/Search/SearchContext"
import { SearchFilters } from "./SearchFilters"
import { SearchResult } from "./SearchResult"

const SEARCH_THROTTLE_INTERVAL = 1000
const MINIMUM_SEARCH_INPUT_LENGTH = 2

export const SearchScreen = () => {
  return (
    <SearchContext.Provider>
      <Search />
    </SearchContext.Provider>
  )
}

export const Search = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { disableFilters, selectFilter } = SearchContext.useStoreActions((actions) => actions)
  const [inputText, setInputText] = useState("")
  const [search, setSearch] = useState("")
  const searchInputRef = useRef<Input>(null)

  useEffect(() => {
    if (inputText.length < MINIMUM_SEARCH_INPUT_LENGTH) {
      selectFilter(null)
      disableFilters([])
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
    selectFilter("All")
    handleSearch(text)
  }

  const handleSearch = useMemo(() => {
    return throttle((searchInput: string) => {
      if (searchInput.length >= MINIMUM_SEARCH_INPUT_LENGTH) {
        setSearch(searchInput)
      }
    }, SEARCH_THROTTLE_INTERVAL)
  }, [])

  const showSearchResults = inputText.length >= MINIMUM_SEARCH_INPUT_LENGTH

  return (
    <Screen>
      <Screen.Body fullwidth safeArea={false}>
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

        {showSearchResults && (
          <Flex mt={2} mb={1}>
            <SearchFilters />
          </Flex>
        )}

        {showSearchResults && <SearchResult searchInput={search} />}
      </Screen.Body>
    </Screen>
  )
}
