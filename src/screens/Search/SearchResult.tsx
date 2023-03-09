import { Avatar, Flex, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { SearchResultQuery } from "__generated__/SearchResultQuery.graphql"
import { SCREEN_HORIZONTAL_PADDING } from "components/Screen/exposed/Body"
import { useAtom } from "jotai"
import { uniq } from "lodash"
import { Suspense, useEffect } from "react"
import { ActivityIndicator, FlatList } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"
import { imageSize } from "utils/imageSize"
import { disabledPillsAtom, selectedPillAtom } from "./searchAtoms"

interface SearchResultProps {
  searchInput: string
}

export const SearchResult = ({ searchInput }: SearchResultProps) => {
  return (
    <Suspense
      fallback={
        <Flex backgroundColor="background" flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator />
        </Flex>
      }
    >
      <SearchResultView searchInput={searchInput} />
    </Suspense>
  )
}

interface SearchResult {
  type: string
  slug: string
  name: string | null
  imageUrl?: string | null
}

const SearchResultView = ({ searchInput }: SearchResultProps) => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const data = useSystemQueryLoader<SearchResultQuery>(searchResultQuery, {
    partnerID,
    searchInput,
    imageSize,
  })
  const variant = isTablet() ? "sm" : "xs"
  const space = useSpace()
  const [selectedPill] = useAtom(selectedPillAtom)
  const [, setDisabledPills] = useAtom(disabledPillsAtom)
  const artists = extractNodes(data.partner?.artistsSearchConnection)
  const artworks =
    searchInput.length > 0 ? extractNodes(data.partner?.artworksSearchConnection) : []
  const shows = extractNodes(data.partner?.showsSearchConnection)

  useEffect(() => {
    if (artists.length === 0) {
      setDisabledPills((prev) => uniq([...prev, "Artists"]))
    } else {
      setDisabledPills((prev) => prev.filter((p) => p !== "Artists"))
    }
    if (shows.length === 0) {
      setDisabledPills((prev) => uniq([...prev, "Shows"]))
    } else {
      setDisabledPills((prev) => prev.filter((p) => p !== "Shows"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artists.length, shows.length])

  const searchResults: SearchResult[] = []
  if (selectedPill === "Artists") {
    searchResults.push(
      ...artists.map((artist) => ({
        ...artist,
        type: "Artist",
      }))
    )
  } else if (selectedPill === "Shows") {
    searchResults.push(
      ...shows.map((show) => ({
        ...show,
        type: "Show",
        imageUrl: show.coverImage?.resized?.url,
      }))
    )
  } else {
    searchResults.push(
      ...artworks.map((artwork) => ({
        ...artwork,
        name: artwork.title,
        type: "Artwork",
        imageUrl: artwork.image?.resized?.url,
      }))
    )
    searchResults.push(
      ...artists.map((artist) => ({
        ...artist,
        type: "Artist",
      }))
    )
    searchResults.push(
      ...shows.map((show) => ({
        ...show,
        type: "Show",
        imageUrl: show.coverImage?.resized?.url,
      }))
    )
  }

  const handleNavigation = (item: SearchResult) => {
    switch (item.type) {
      case "Artist":
        navigation.navigate("ArtistTabs", {
          slug: item.slug,
          name: item.name!,
        })
        break
      case "Show":
        navigation.navigate("ShowTabs", {
          slug: item.slug,
        })
        break
      default:
        navigation.navigate("Artwork", {
          slug: item.slug,
        })
    }
  }

  return (
    <FlatList
      data={searchResults}
      contentContainerStyle={{ paddingHorizontal: space(SCREEN_HORIZONTAL_PADDING) }}
      renderItem={({ item }) => (
        <Touchable onPress={() => handleNavigation(item)}>
          <Flex py={1} backgroundColor="background" flexDirection="row">
            <Avatar src={item.imageUrl!} size={variant} />
            <Flex mx={1}>
              <Text variant={variant}>{item.name}</Text>
              <Text variant={variant} color="onBackgroundMedium">
                {item.type}
              </Text>
            </Flex>
          </Flex>
        </Touchable>
      )}
      keyExtractor={(item, index) => item?.slug ?? `${index}`}
    />
  )
}

const searchResultQuery = graphql`
  query SearchResultQuery($partnerID: String!, $searchInput: String!, $imageSize: Int!) {
    partner(id: $partnerID) {
      showsSearchConnection(query: $searchInput) {
        edges {
          node {
            internalID
            name
            slug
            coverImage {
              resized(width: $imageSize, version: "normalized") {
                url
              }
            }
          }
        }
      }
      artistsSearchConnection(query: $searchInput) {
        edges {
          node {
            internalID
            name
            slug
            imageUrl
          }
        }
      }
      artworksSearchConnection(query: $searchInput) {
        edges {
          node {
            internalID
            title
            slug
            image {
              resized(width: $imageSize, version: "normalized") {
                url
              }
            }
          }
        }
      }
    }
  }
`
