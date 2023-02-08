import { Flex, Button, SearchInput, Separator, Text, Spacer } from "@artsy/palette-mobile"
import { useState, useEffect, useRef, Suspense } from "react"
import { ActivityIndicator, FlatList } from "react-native"
import { graphql } from "react-relay"
import { SelectPartnerQuery } from "__generated__/SelectPartnerQuery.graphql"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { RetryErrorBoundary } from "app/system/wrappers/RetryErrorBoundary"
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
      <RetryErrorBoundary
        catch={(e) => {
          if (e.message.includes("Forbidden") && e.message.includes("Not authorized")) {
            // this shows up if a user logs in with a user that is not a partner
            GlobalStore.actions.auth.signOut()
          }
        }}
      >
        <Suspense fallback={<ActivityIndicator />}>
          <SelectPartner />
        </Suspense>
      </RetryErrorBoundary>
    </Screen.Body>
  </Screen>
)

const SelectPartner = () => {
  const data = useSystemQueryLoader<SelectPartnerQuery>(
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
    <>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item?.internalID!}
        renderItem={({ item: partner }) => (
          <Button
            variant="outline"
            block
            onPress={() => GlobalStore.actions.auth.setActivePartnerID(partner!.internalID)}
          >
            {partner!.name}
          </Button>
        )}
        ItemSeparatorComponent={() => <Spacer y={2} />}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SelectPartnerHeader onSearchChange={setSearch} searchValue={search} />
        }
        ListEmptyComponent={<ListEmptyComponent text="No partners found" />}
      />
      <Button variant="outlineGray" block onPress={() => void GlobalStore.actions.auth.signOut()}>
        Log out
      </Button>
    </>
  )
}
