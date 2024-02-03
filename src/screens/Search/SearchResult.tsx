import { Avatar, Flex, Text, Touchable, useSpace } from "@artsy/palette-mobile"
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
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"
import { imageSize } from "utils/imageSize"

interface SearchResultProps {
  searchInput: string
}

export const SearchResult: React.FC<SearchResultProps> = ({ searchInput }) => {
  const isDarkMode = useIsDarkMode()

  return (
    <Suspense
      fallback={
        <Flex
          backgroundColor="background"
          flex={1}
          justifyContent="center"
          alignItems="center"
        >
          <ActivityIndicator color={isDarkMode ? "white" : "black"} />
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
  const space = useSpace()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )!
  const { data } = useSystemQueryLoader<SearchResultQuery>(searchResultQuery, {
    partnerID,
    searchInput,
    imageSize,
  })
  const variant = isTablet() ? "sm" : "xs"

  const { currentFilter } = SearchContext.useStoreState((state) => state)
  const { disableFilters } = SearchContext.useStoreActions((actions) => actions)

  const artists = extractNodes(data.partner?.artistsSearchConnection)

  const artworks =
    searchInput.length > 0
      ? extractNodes(data.partner?.artworksSearchConnection)
      : []

  const shows = extractNodes(data.partner?.showsSearchConnection)

  const albums = GlobalStore.useAppState((state) => state.albums.albums)

  const searchResults = (() => {
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
    const albumArtworkResults = uniqBy(
      intersectionBy(
        artworkResults,
        albums
          .flatMap((album) => album.items)
          .filter((item) => item?.__typename === "Artwork")
          .map((item) => ({
            ...item,
            type: "AlbumArtwork",
          })) as (SelectedItemArtwork & { type: string })[],
        "internalID"
      ),
      "internalID"
    )

    const albumResults = albums.reduce((acc: any, album) => {
      const foundAlbum = album.name
        .toLowerCase()
        .includes(searchInput.toLowerCase())

      const items = album.items as SelectedItemArtwork[]

      const foundArtworksInAlbum = artworkResults.some((artwork) => {
        return items.some((item) => item?.internalID === artwork?.internalID)
      })

      if (foundAlbum || foundArtworksInAlbum) {
        return [
          ...acc,
          {
            imageUrl: items[0]?.image?.resized?.url,
            internalID: album?.id, // Albums don't have slugs, so use the album id
            slug: album?.id, // Albums don't have slugs, so use the album id
            name: album?.name,
            type: "Album",
          },
        ]
      }

      return acc
    }, [])

    const results = {
      allResults: uniqBy(
        [
          ...artworkResults,
          ...artistResults,
          ...showResults,
          ...albumResults,
          ...albumArtworkResults,
        ],
        "internalID"
      ),
      filteredResults: (() => {
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
        }
      })(),
    }

    return results
  })()

  useEffect(() => {
    const albums = searchResults.allResults.filter(
      (result) => result.type === "Album"
    )
    const artists = searchResults.allResults.filter(
      (result) => result.type === "Artist"
    )
    const shows = searchResults.allResults.filter(
      (result) => result.type === "Show"
    )

    const maybeDisbleFilters: [any[], Filters][] = [
      [albums, "Albums"],
      [artists, "Artists"],
      [shows, "Shows"],
    ]

    const disabledFilters: any = []

    maybeDisbleFilters.forEach(([results, filterName]) => {
      if (results.length === 0) {
        disabledFilters.push(filterName)
      }
    })

    if (searchResults.allResults.length === 0) {
      disabledFilters.push("All")
    }

    disableFilters(disabledFilters)
  }, [searchResults.allResults.length])

  const handleNavigation = (item: SearchResult) => {
    switch (item.type) {
      case "Album": {
        navigation.navigate("AlbumTabs", {
          albumId: item.slug,
        })
        break
      }
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

  const listData =
    currentFilter === "All"
      ? searchResults.allResults
      : searchResults.filteredResults

  if (!listData.length) {
    return <Text>No results</Text>
  }

  return (
    <FlatList
      data={listData}
      contentContainerStyle={{ paddingBottom: space(4) }}
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
  query SearchResultQuery(
    $partnerID: String!
    $searchInput: String!
    $imageSize: Int!
  ) {
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
