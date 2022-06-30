import { Button, Flex, SearchInput, Separator, Spacer, Text } from "palette"
import { GlobalStore } from "app/store/GlobalStore"
import { useState, useEffect, useRef } from "react"
import { FlatList } from "react-native"
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { SelectPartnerQuery } from "__generated__/SelectPartnerQuery.graphql"
import { ListEmptyComponent } from "app/sharedUI"
import { SuspenseWrapper } from "app/wrappers"

type Partners = NonNullable<NonNullable<SelectPartnerQuery["response"]["me"]>["partners"]>

interface SelectPartnerHeaderProps {
  onSearchChange: (term: string) => void
  searchValue: string
}
export const SelectPartnerHeader: React.FC<SelectPartnerHeaderProps> = ({
  onSearchChange,
  searchValue,
}) => {
  return (
    <Flex backgroundColor="white" mb={2} flexDirection="column" alignItems="center">
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
}

export const SelectPartner: React.FC<{}> = ({}) => {
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

  const { width } = useSafeAreaFrame()
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
      renderItem={({ item: partner }) => {
        return <PartnerRow partner={partner!} />
      }}
      ItemSeparatorComponent={() => <Spacer mt={2} />}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={<SelectPartnerHeader onSearchChange={setSearch} searchValue={search} />}
      ListEmptyComponent={<ListEmptyComponent text={"No partners found"} />}
      contentContainerStyle={{ width: width - 20 }}
      showsVerticalScrollIndicator={false}
    />
  )
}

interface PartnerRow {
  partner: NonNullable<Partners[0]>
}

const PartnerRow: React.FC<PartnerRow> = ({ partner }) => (
  <Button
    variant="outline"
    block
    onPress={() => {
      GlobalStore.actions.setActivePartnerID(partner.internalID)
    }}
  >
    <Text>{partner.name}</Text>
  </Button>
)

export const SelectPartnerScreen = () => {
  return (
    <SuspenseWrapper>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <SelectPartner />
      </SafeAreaView>
    </SuspenseWrapper>
  )
}
