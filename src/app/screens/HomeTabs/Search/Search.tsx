import {
  Button,
  Flex,
  Input,
  MagnifyingGlassIcon,
  Separator,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { isEqual, throttle } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import { NavigationScreens } from "app/navigation/Main"
import { Screen } from "palette"
import { SearchResult } from "./SearchResult"

const PILLS = ["Artists", "Shows", "Albums"]
const SEARCH_THROTTLE_INTERVAL = 1000
const MINIMUM_SEARCH_INPUT_LENGTH = 2

export const Search = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const [inputText, setInputText] = useState("")
  const [search, setSearch] = useState("")
  const searchInputRef = useRef<Input>(null)
  const [selectedPills, setSelectedPills] = useState<string[]>([])

  useEffect(() => {
    if (searchInputRef.current) {
      const unsubscribe = navigation.addListener("focus", () => {
        searchInputRef.current?.focus()
      })
      return unsubscribe
    }
  }, [navigation, searchInputRef.current])

  useEffect(() => {
    if (PILLS.every((f) => selectedPills.includes(f))) {
      setSelectedPills(["All"])
    }
  }, [selectedPills.length])

  const handleChangeText = (text: string) => {
    setInputText(text)
    if (selectedPills.length === 0) {
      setSelectedPills(["All"])
    }
    handleSearch(text)
  }

  const handleSelectPill = (pill: string) => {
    if (!selectedPills.includes(pill)) {
      if (pill === "All") {
        setSelectedPills([pill])
      } else {
        const otherPills = selectedPills.filter((p) => p !== "All")
        setSelectedPills([...otherPills, pill])
      }
    } else {
      if (!isEqual(selectedPills, ["All"])) {
        const unSelectedPills = selectedPills.filter((p) => p !== pill)
        if (unSelectedPills.length !== 0) {
          setSelectedPills(unSelectedPills)
        } else {
          setSelectedPills(["All"])
        }
      }
    }
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
          {["All"].concat(PILLS).map((pill, index) => {
            return (
              <Button
                key={index}
                size="small"
                variant={selectedPills.includes(pill) ? "fillSuccess" : "outlineGray"}
                onPress={() => handleSelectPill(pill)}
                mr={1}
              >
                {pill}
              </Button>
            )
          })}
        </Flex>
        <Spacer y={1} />
        {search.length >= 2 && <SearchResult searchInput={search} selectedFilter={selectedPills} />}
      </Screen.Body>
    </Screen>
  )
}
