import {
  Flex,
  Input,
  MagnifyingGlassIcon,
  Separator,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { throttle } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import { NavigationScreens } from "app/navigation/Main"
import { Screen } from "palette"
import { Pill } from "palette/elements/Pill"
import { SearchResult } from "./SearchResult"

const PILLS = ["All", "Artists", "Shows", "Albums"]
const SEARCH_THROTTLE_INTERVAL = 1000
const MINIMUM_SEARCH_INPUT_LENGTH = 2

export const Search = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const [inputText, setInputText] = useState("")
  const [search, setSearch] = useState("")
  const searchInputRef = useRef<Input>(null)

  useEffect(() => {
    if (searchInputRef.current) {
      const unsubscribe = navigation.addListener("focus", () => {
        searchInputRef.current?.focus()
      })
      return unsubscribe
    }
  }, [navigation, searchInputRef.current])

  const handleSearch = useMemo(
    () =>
      throttle((searchInput: string) => {
        if (searchInput.length >= MINIMUM_SEARCH_INPUT_LENGTH) {
          setSearch(searchInput)
        }
      }, SEARCH_THROTTLE_INTERVAL),
    []
  )

  const handleChangeText = (text: string) => {
    setInputText(text)
    handleSearch(text)
  }

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
            <Touchable onPress={() => navigation.goBack()}>
              <Text variant="xs">Cancel</Text>
            </Touchable>
          </Flex>
          <Separator />
        </Flex>
      </Screen.RawHeader>
      <Screen.Body>
        <Spacer y={2} />
        <Flex flexDirection="row">
          {PILLS.map((pill, index) => {
            return (
              <Pill mr={1} key={index} rounded onPress={() => console.log(pill)}>
                {pill}
              </Pill>
            )
          })}
        </Flex>
        <Spacer y={1} />
        {search.length >= 2 && <SearchResult searchInput={search} />}
      </Screen.Body>
    </Screen>
  )
}
