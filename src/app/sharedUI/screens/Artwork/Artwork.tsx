import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArtworkContent } from "./ArtworkContent/ArtworkContent"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { ScrollableScreenEntity, ScrollableScreensView } from "app/sharedUI"
import { SuspenseWrapper } from "app/wrappers"
import { ArrowLeftIcon, Flex, Touchable, useSpace } from "palette"

type ArtworkRoute = RouteProp<HomeTabsScreens, "Artwork">

export const Artwork = () => {
  const { params } = useRoute<ArtworkRoute>()
  const artworkSlugs = params.contextArtworkSlugs ?? [params.slug]
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const space = useSpace()
  const screens: ScrollableScreenEntity[] = artworkSlugs.map((slug) => ({
    name: slug,
    content: (
      <SuspenseWrapper key={slug}>
        <ScrollView style={{ paddingHorizontal: space(2) }}>
          <ArtworkContent slug={slug} />
        </ScrollView>
      </SuspenseWrapper>
    ),
  }))

  return (
    <Flex flex={1} pt={insets.top} mt={2}>
      <Flex px={2}>
        <Touchable
          onPress={() => {
            navigation.goBack()
          }}
        >
          <ArrowLeftIcon fill="black100" />
        </Touchable>
      </Flex>

      <Flex flex={1} my={2}>
        <ScrollableScreensView screens={screens} initialScreenName={params.slug} />
      </Flex>
    </Flex>
  )
}
