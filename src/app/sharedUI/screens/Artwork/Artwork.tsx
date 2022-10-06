import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useMemo, useRef } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtworkQuery } from "__generated__/ArtworkQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header, ScrollableScreenEntity, ScrollableScreensView } from "app/sharedUI"
import {
  BottomSheetModalRow,
  BottomSheetModalView,
  BottomSheetRef,
} from "app/sharedUI/molecules/BottomSheetModalView"
import { GlobalStore } from "app/store/GlobalStore"
import { SuspenseWrapper } from "app/wrappers"
import { Flex, MoreIcon, Touchable, ArtworkIcon, EditIcon, BriefcaseIcon } from "palette"
import { ArtworkContent } from "./ArtworkContent/ArtworkContent"
import { EditArtworkInCms } from "./EditArtworkInCms"

type ArtworkRoute = RouteProp<HomeTabsScreens, "Artwork">

export const Artwork = () => {
  const { contextArtworkSlugs, slug } = useRoute<ArtworkRoute>().params
  const artworkSlugs = contextArtworkSlugs ?? [slug]
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const artworkData = useLazyLoadQuery<ArtworkQuery>(artworkQuery, {
    slug,
  })
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const screens: ScrollableScreenEntity[] = artworkSlugs.map((slug) => ({
    name: slug,
    content: (
      <SuspenseWrapper key={slug}>
        <ArtworkContent slug={slug} />
      </SuspenseWrapper>
    ),
  }))

  const numberOfAlbumsIncludingArtwork = useMemo(() => {
    return albums.filter((album) => album.artworkIds.includes(artworkData.artwork?.internalID!))
      .length
  }, [albums])

  const isEditArtworkHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.editArtwork
  )

  const addToButtonHandler = () => {
    bottomSheetRef.current?.showBottomSheetModal()
  }

  return (
    <BottomSheetModalProvider>
      <Header
        safeAreaInsets
        rightElements={
          <Touchable
            onPress={addToButtonHandler}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <MoreIcon />
          </Touchable>
        }
      />
      <Flex flex={1}>
        <ScrollableScreensView screens={screens} initialScreenName={slug} />
      </Flex>
      <BottomSheetModalView
        ref={bottomSheetRef}
        modalHeight={500}
        modalRows={
          <>
            <BottomSheetModalRow
              Icon={<ArtworkIcon fill="onBackgroundHigh" />}
              label="View in Room"
              navigateTo={() => {}}
            />
            <BottomSheetModalRow
              Icon={<EditIcon fill="onBackgroundHigh" />}
              label="Send by Email"
              navigateTo={() => {}}
            />
            <BottomSheetModalRow
              Icon={<BriefcaseIcon fill="onBackgroundHigh" />}
              label="Add to Album"
              subtitle={
                numberOfAlbumsIncludingArtwork === 0
                  ? null
                  : numberOfAlbumsIncludingArtwork === albums.length
                  ? "Currently in all albums"
                  : numberOfAlbumsIncludingArtwork === 1
                  ? "Currently in 1 album"
                  : `Currently in ${numberOfAlbumsIncludingArtwork} albums`
              }
              navigateTo={() =>
                navigation.navigate("AddArtworkToAlbum", { slug, contextArtworkSlugs })
              }
            />
          </>
        }
        extraButtons={!isEditArtworkHidden && <EditArtworkInCms slug={slug} />}
      />
    </BottomSheetModalProvider>
  )
}

const artworkQuery = graphql`
  query ArtworkQuery($slug: String!) {
    artwork(id: $slug) {
      internalID
    }
  }
`
