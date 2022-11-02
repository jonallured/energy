import { Avatar, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Suspense, useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery } from "react-relay"
import { SearchResultQuery } from "__generated__/SearchResultQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { GlobalStore } from "app/store/GlobalStore"
import { imageSize } from "app/utils/imageSize"
import { extractNodes } from "shared/utils"

interface SearchResultProps {
  searchInput: string
  selectedFilter: string[]
}

export const SearchResult = ({ searchInput, selectedFilter }: SearchResultProps) => {
  return (
    <Suspense
      fallback={
        <Flex backgroundColor="background" flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator />
        </Flex>
      }
    >
      <SearchResultView searchInput={searchInput} selectedFilter={selectedFilter} />
    </Suspense>
  )
}

type SearchResult = {
  type: string
  slug: string
  name: string | null
  imageUrl?: string | null
}

const SearchResultView = ({ searchInput, selectedFilter }: SearchResultProps) => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const data = useLazyLoadQuery<SearchResultQuery>(searchResultQuery, {
    partnerID,
    searchInput,
    imageSize,
  })
  const [searchResult, setSearchResult] = useState<SearchResult[]>([])
  const variant = isTablet() ? "sm" : "xs"

  const artists = extractNodes(data.partner?.artistsSearchConnection)
  const artworks =
    searchInput.length > 0 ? extractNodes(data.partner?.artworksSearchConnection) : []
  const shows = extractNodes(data.partner?.showsSearchConnection)

  const search: SearchResult[] = []
  artists.map((artist) => {
    search.push({
      slug: artist.slug,
      type: artist.__typename,
      name: artist.name,
      imageUrl: artist.imageUrl,
    })
  })

  artworks.map((artwork) => {
    search.push({
      slug: artwork.slug,
      type: artwork.__typename,
      name: artwork.title,
      imageUrl: artwork.image?.resized?.url,
    })
  })

  shows.map((show) => {
    search.push({
      slug: show.slug,
      type: show.__typename,
      name: show.name,
      imageUrl: show.coverImage?.resized?.url,
    })
  })

  useEffect(() => {
    // Logic for Album filteration will be added later
    if (["Artists", "Shows"].every((f) => selectedFilter.includes(f))) {
      const filteredArtists = search.filter((searchObj) => searchObj.type === "Artist")
      const filteredShows = search.filter((searchObj) => searchObj.type === "Show")
      setSearchResult([...filteredArtists, ...filteredShows])
    } else if (selectedFilter.includes("Artists")) {
      const filteredArtists = search.filter((searchObj) => searchObj.type === "Artist")
      setSearchResult(filteredArtists)
    } else if (selectedFilter.includes("Shows")) {
      const filteredShows = search.filter((searchObj) => searchObj.type === "Show")
      setSearchResult(filteredShows)
    } else {
      setSearchResult(search)
    }
  }, [searchInput, selectedFilter])

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
    <>
      {searchResult.map((item, i) => (
        <Touchable key={i} onPress={() => handleNavigation(item)}>
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
      ))}
    </>
  )
}

const searchResultQuery = graphql`
  query SearchResultQuery($partnerID: String!, $searchInput: String!, $imageSize: Int!) {
    partner(id: $partnerID) {
      showsSearchConnection(query: $searchInput) {
        edges {
          node {
            __typename
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
            __typename
            name
            slug
            imageUrl
          }
        }
      }
      artworksSearchConnection(query: $searchInput) {
        edges {
          node {
            __typename
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
