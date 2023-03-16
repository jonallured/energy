import { Button, Flex, useSpace } from "@artsy/palette-mobile"
import { FlatList } from "react-native"
import { Filters, SearchContext } from "screens/Search/SearchContext"

const FILTERS: Filters[] = ["Artists", "Shows", "Albums"]

export const SearchFilters = () => {
  const { currentFilter, disabledFilters } = SearchContext.useStoreState((state) => state)
  const { selectFilter } = SearchContext.useStoreActions((actions) => actions)
  const space = useSpace()

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={["All" as Filters].concat(FILTERS)}
      renderItem={({ item, index }) => {
        const isDisabled = disabledFilters.includes(item)

        if (isDisabled) {
          return null
        }

        return (
          <Button
            key={item}
            size="small"
            variant={currentFilter === item ? "fillSuccess" : "outlineGray"}
            onPress={() => selectFilter(item)}
            disabled={disabledFilters.includes(item)}
            ml={index === 0 ? 2 : 0}
            mr={1}
          >
            {item}
          </Button>
        )
      }}
      ListFooterComponent={<Flex pr={2} />}
    />
  )
}
