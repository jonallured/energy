import { RouteProp, useRoute } from "@react-navigation/native"
import { ArtworkContent } from "./ArtworkContent/ArtworkContent"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header, ScrollableScreenEntity, ScrollableScreensView } from "app/sharedUI"
import { SuspenseWrapper } from "app/wrappers"
import { Flex } from "palette"

type ArtworkRoute = RouteProp<HomeTabsScreens, "Artwork">

export const Artwork = () => {
  const { params } = useRoute<ArtworkRoute>()
  const artworkSlugs = params.contextArtworkSlugs ?? [params.slug]
  const screens: ScrollableScreenEntity[] = artworkSlugs.map((slug) => ({
    name: slug,
    content: (
      <SuspenseWrapper key={slug}>
        <ArtworkContent slug={slug} />
      </SuspenseWrapper>
    ),
  }))

  return (
    <>
      <Header />
      <Flex flex={1}>
        <ScrollableScreensView screens={screens} initialScreenName={params.slug} />
      </Flex>
    </>
  )
}
