import { Flex, Button, SearchInput, Separator, Text, Spacer } from "@artsy/palette-mobile"
import { useState, useEffect, useRef, Suspense } from "react"
import { ActivityIndicator, FlatList } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { SelectPartnerQuery } from "__generated__/SelectPartnerQuery.graphql"
import { ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Screen } from "palette"

interface SelectPartnerHeaderProps {
  onSearchChange: (term: string) => void
  searchValue: string
}
export const SelectPartnerHeader = ({ onSearchChange, searchValue }: SelectPartnerHeaderProps) => (
  <Flex mb={2} flexDirection="column" alignItems="center" backgroundColor="background">
    <Text variant="md" textAlign="center">
      Select a partner to continue
    </Text>
    <SearchInput
      placeholder="Type to search..."
      onChangeText={onSearchChange}
      value={searchValue}
    />
    <Separator mt={2} />
  </Flex>
)

export const SelectPartnerScreen = () => (
  <Screen>
    <Screen.Body>
      <Suspense fallback={<ActivityIndicator />}>
        <SelectPartner />
      </Suspense>
    </Screen.Body>
  </Screen>
)

const SelectPartner = () => {
  const data = useLazyLoadQuery<SelectPartnerQuery>(
    graphql`
      query SelectPartnerQuery {
        me {
          partners {
            name
            internalID
          }
        }
      }
    `,
    {}
  )

  const [search, setSearch] = useState("")
  const partners = useRef(data.me?.partners).current
  const [filteredData, setFilteredData] = useState(partners)

  useEffect(() => {
    if (!partners) return
    setFilteredData(
      partners.filter((partner) => {
        const name = partner?.name?.toLowerCase() || ""
        return name?.indexOf(search.toLowerCase()) > -1
      })
    )
  }, [search, partners])

  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item?.internalID!}
      renderItem={({ item: partner }) => (
        <Button
          variant="outline"
          block
          onPress={() => GlobalStore.actions.setActivePartnerID(partner!.internalID)}
        >
          {partner!.name}
        </Button>
      )}
      ItemSeparatorComponent={() => <Spacer mt={2} />}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={<SelectPartnerHeader onSearchChange={setSearch} searchValue={search} />}
      ListEmptyComponent={<ListEmptyComponent text="No partners found" />}
      showsVerticalScrollIndicator={false}
    />
  )
}
