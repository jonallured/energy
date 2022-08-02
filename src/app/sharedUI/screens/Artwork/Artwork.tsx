import { RouteProp, useRoute } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArtworkContent } from "./ArtworkContent/ArtworkContent"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header, ScrollableScreenEntity, ScrollableScreensView } from "app/sharedUI"
import { Flex } from "palette"
import { SuspenseWrapper } from "app/wrappers"

type ArtworkRoute = RouteProp<HomeTabsScreens, "Artwork">

export const Artwork = () => {
  const { params } = useRoute<ArtworkRoute>()
  const artworkSlugs = params.contextArtworkSlugs ?? [params.slug]
  const insets = useSafeAreaInsets()
  const screens: ScrollableScreenEntity[] = artworkSlugs.map((slug) => ({
    name: slug,
    content: (
      <SuspenseWrapper key={slug}>
        <ArtworkContent slug={slug} />
      </SuspenseWrapper>
    ),
  }))

  return (
    <Flex flex={1} pt={insets.top}>
      <Header />
      <ScrollableScreensView screens={screens} initialScreenName={params.slug} />
    </Flex>
  )
}
