import { Avatar, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { SearchResultQuery } from "__generated__/SearchResultQuery.graphql"
import { intersectionBy, uniqBy } from "lodash"
import { Suspense, useEffect } from "react"
import { ActivityIndicator, FlatList } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { Filters, SearchContext } from "screens/Search/SearchContext"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { extractNodes } from "utils/extractNodes"
import { imageSize } from "utils/imageSize"

interface SearchResultProps {
  searchInput: string
}

export const SearchResult: React.FC<SearchResultProps> = ({ searchInput }) => {
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
  name?: string | null
  imageUrl?: string | null
}

const SearchResultView = ({ searchInput }: SearchResultProps) => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const { data } = useSystemQueryLoader<SearchResultQuery>(searchResultQuery, {
    partnerID,
    searchInput,
    imageSize,
  })
  const variant = isTablet() ? "sm" : "xs"

  const { currentFilter, disabledFilters } = SearchContext.useStoreState((state) => state)
  const { disableFilters } = SearchContext.useStoreActions((actions) => actions)

  const artists = extractNodes(data.partner?.artistsSearchConnection)
  const artworks =
    searchInput.length > 0 ? extractNodes(data.partner?.artworksSearchConnection) : []
  const shows = extractNodes(data.partner?.showsSearchConnection)
  const albums = GlobalStore.useAppState((state) => state.albums.albums)

  useEffect(() => {
    const maybeDisbleFilters: [any[], Filters][] = [
      [albums, "Albums"],
      [artists, "Artists"],
      [shows, "Shows"],
    ]

    maybeDisbleFilters.forEach(([filter, filterName]) => {
      if (filter.length === 0) {
        disableFilters([filterName])
      } else {
        disableFilters(disabledFilters.filter((filter) => filter !== filterName))
      }
    })
  }, [albums.length, artists.length, shows.length])

  const searchResults: SearchResult[] = (() => {
    const artworkResults = artworks.map((artwork) => ({
      ...artwork,
      name: artwork.title,
      type: "Artwork",
      imageUrl: artwork.image?.resized?.url,
    }))

    const artistResults = artists.map((artist) => ({
      ...artist,
      type: "Artist",
    }))

    const showResults = shows.map((show) => ({
      ...show,
      type: "Show",
      imageUrl: show.coverImage?.resized?.url,
    }))

    // Cross-reference returned artworks to determine which album items we
    // should display in search results. If internalID from an artwork matches,
    // we know its in an album and should display it.
    const albumResults = uniqBy(
      intersectionBy(
        artworkResults,
        albums
          .flatMap((album) => album.items)
          .filter((item) => item?.__typename === "Artwork")
          .map((item) => ({
            ...item,
            type: "Album",
          })) as (SelectedItemArtwork & { type: string })[],
        "internalID"
      ),
      "internalID"
    )

    switch (currentFilter) {
      case "Artists": {
        return artistResults
      }
      case "Shows": {
        return showResults
      }
      case "Albums": {
        return albumResults
      }
      // All
      default: {
        return uniqBy(
          [...artworkResults, ...artistResults, ...showResults, ...albumResults],
          "internalID"
        )
      }
    }
  })()

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
