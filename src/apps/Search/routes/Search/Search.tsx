import {
  DEFAULT_HIT_SLOP,
  Flex,
  Input,
  MagnifyingGlassIcon,
  Separator,
  Screen,
  Text,
  Touchable,
  Button,
} from "@artsy/palette-mobile"
import { Filters, SearchContext } from "apps/Search/SearchContext"
import { throttle } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import { FlatList } from "react-native"
import { useRouter } from "system/hooks/useRouter"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"
import { SearchResult } from "./SearchResult"

const SEARCH_THROTTLE_INTERVAL = 1000
const MINIMUM_SEARCH_INPUT_LENGTH = 2

const FILTERS: Filters[] = ["All", "Artists", "Shows", "Albums"]

export const SearchScreen = () => {
  useTrackScreen({ name: "Search", type: "Search" })

  return (
    <SearchContext.Provider>
      <Search />
    </SearchContext.Provider>
  )
}

export const Search: React.FC = () => {
  const { router } = useRouter()
  const isDarkMode = useIsDarkMode()

  const { disableFilters, selectFilter } = SearchContext.useStoreActions(
    (actions) => actions
  )
  const { currentFilter, disabledFilters } = SearchContext.useStoreState(
    (state) => state
  )

  const [inputText, setInputText] = useState("")
  const [search, setSearch] = useState("")
  const searchInputRef = useRef<Input>(null)

  useEffect(() => {
    if (inputText.length < MINIMUM_SEARCH_INPUT_LENGTH) {
      selectFilter(null)
      disableFilters([])
    }
  }, [inputText])

  useEffect(() => {
    // Slight delay to autoshow the keyboard when the screen first renders
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 800)
  }, [])

  const handleChangeText = (text: string) => {
    setInputText(text)
    selectFilter("All")
    handleSearch(text)
  }

  const handleSearch = useMemo(() => {
    return throttle(
      (searchInput: string) => {
        if (searchInput.length >= MINIMUM_SEARCH_INPUT_LENGTH) {
          setSearch(searchInput)
        }
      },
      SEARCH_THROTTLE_INTERVAL,
      { trailing: true }
    )
  }, [])

  const showSearchResults = inputText.length >= MINIMUM_SEARCH_INPUT_LENGTH

  return (
    <Screen>
      <Screen.Body>
        <Flex mt={0.5}>
          <Flex flexDirection="row" alignItems="center">
            <Input
              ref={searchInputRef}
              style={{ borderWidth: 0, left: -11 }}
              icon={<MagnifyingGlassIcon />}
              onChangeText={(text) => handleChangeText(text.trim())}
              value={inputText}
              focusable
              placeholder="Search"
              enableClearButton
            />

            <Touchable
              onPress={() => router.goBack()}
              hitSlop={DEFAULT_HIT_SLOP}
            >
              <Text variant="xs">Cancel</Text>
            </Touchable>
          </Flex>

          <Separator />
        </Flex>

        <Screen.FullWidthItem>
          <Flex mt={2} mb={1}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={FILTERS}
              renderItem={({ item, index }) => {
                const isDisabled = disabledFilters.includes(item)

                if (isDisabled) {
                  return null
                }

                return (
                  <Button
                    key={item}
                    size="small"
                    variant={
                      currentFilter === item
                        ? "fillSuccess"
                        : isDarkMode
                        ? "outlineLight"
                        : "outlineGray"
                    }
                    onPress={() => selectFilter(item)}
                    disabled={
                      !showSearchResults || disabledFilters.includes(item)
                    }
                    ml={index === 0 ? 2 : 0}
                    mr={1}
                  >
                    {item}
                  </Button>
                )
              }}
              ListFooterComponent={<Flex pr={2} />}
            />
          </Flex>
        </Screen.FullWidthItem>

        {!!showSearchResults && <SearchResult searchInput={search} />}
      </Screen.Body>
    </Screen>
  )
}
