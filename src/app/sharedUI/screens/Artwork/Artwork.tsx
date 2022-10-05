import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useRef } from "react"
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
  const { params } = useRoute<ArtworkRoute>()
  const artworkSlugs = params.contextArtworkSlugs ?? [params.slug]
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const screens: ScrollableScreenEntity[] = artworkSlugs.map((slug) => ({
    name: slug,
    content: (
      <SuspenseWrapper key={slug}>
        <ArtworkContent slug={slug} />
      </SuspenseWrapper>
    ),
  }))

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
        <ScrollableScreensView screens={screens} initialScreenName={params.slug} />
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
              navigateTo={() => navigation.navigate("AddArtworkToAlbum", { slug: params.slug })}
            />
          </>
        }
        extraButtons={!isEditArtworkHidden && <EditArtworkInCms slug={params.slug} />}
      />
    </BottomSheetModalProvider>
  )
}
