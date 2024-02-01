import {
  Flex,
  Button,
  SearchInput,
  Separator,
  Text,
  Spacer,
  Screen,
  Box,
} from "@artsy/palette-mobile"
import { SelectPartnerQuery } from "__generated__/SelectPartnerQuery.graphql"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { useState, useEffect, useRef, Suspense } from "react"
import { ActivityIndicator, FlatList } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { RetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"

export const SelectPartnerScreen: React.FC = () => {
  useTrackScreen({ name: "SelectPartner" })

  return (
    <Screen>
      <Screen.Body>
        <RetryErrorBoundary
          catch={(e) => {
            if (
              e.message.includes("Forbidden") &&
              e.message.includes("Not authorized")
            ) {
              // this shows up if a user logs in with a user that is not a partner
              GlobalStore.actions.auth.signOut()
            }
          }}
        >
          <Suspense
            fallback={
              <Box mt={4}>
                <ActivityIndicator />
              </Box>
            }
          >
            <SelectPartner />
          </Suspense>
        </RetryErrorBoundary>
      </Screen.Body>
    </Screen>
  )
}

interface SelectPartnerHeaderProps {
  onSearchChange: (term: string) => void
  searchValue: string
}

export const SelectPartnerHeader = ({
  onSearchChange,
  searchValue,
}: SelectPartnerHeaderProps) => {
  return (
    <Flex
      mb={2}
      flexDirection="column"
      alignItems="center"
      backgroundColor="background"
    >
      <Text variant="md" textAlign="center" my={2}>
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

const SelectPartner: React.FC = () => {
  const { data } = useSystemQueryLoader<SelectPartnerQuery>(
    graphql`
      query SelectPartnerQuery {
        me {
          partners(size: 100) {
            name
            internalID
            slug
          }
        }
      }
    `,
    {},
    { fetchPolicy: "network-only", networkCacheConfig: { force: true } }
  )

  const [search, setSearch] = useState("")
  const partners = useRef(data.me?.partners).current
  const [filteredData, setFilteredData] = useState(partners)
  const insets = useSafeAreaInsets()

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
            onPress={() =>
              GlobalStore.actions.auth.setActivePartnerID({
                internalID: partner?.internalID as string,
                name: partner?.name as string,
                slug: partner?.slug as string,
              })
            }
          >
            {partner!.name}
          </Button>
        )}
        ItemSeparatorComponent={() => <Spacer y={2} />}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SelectPartnerHeader
            onSearchChange={setSearch}
            searchValue={search}
          />
        }
        ListEmptyComponent={<ListEmptyComponent text="No partners found" />}
      />
      <Button
        bottom={insets.bottom}
        variant="outlineGray"
        block
        onPress={() => void GlobalStore.actions.auth.signOut()}
      >
        Log out
      </Button>
    </>
  )
}
