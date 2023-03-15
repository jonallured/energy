import {
  EditIcon,
  BriefcaseIcon,
  Touchable,
  MoreIcon,
  Flex,
  DEFAULT_HIT_SLOP,
} from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ArtworkQuery } from "__generated__/ArtworkQuery.graphql"
import {
  BottomSheetRef,
  BottomSheetModalView,
  BottomSheetModalRow,
} from "components/BottomSheet/BottomSheetModalView"
import { PageableScreenView } from "components/PageableScreen/PageableScreenView"
import { ScrollableScreenEntity } from "components/PageableScreen/PageableScreensContext"
import { Screen } from "components/Screen"
import { SCREEN_HORIZONTAL_PADDING } from "components/Screen/constants"
import { filter } from "lodash"
import { Suspense, useMemo, useRef } from "react"
import { ActivityIndicator } from "react-native"
import { graphql } from "react-relay"
import { useMailComposer } from "screens/Artwork/useMailComposer"
import { useSaveNavigationHistory } from "system/hooks/useNavigationHistory"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItem, SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { ArtworkContent } from "./ArtworkContent/ArtworkContent"
import { EditArtworkInCms } from "./EditArtworkInCms"

type ArtworkRoute = RouteProp<NavigationScreens, "Artwork">

export const Artwork = () => {
  const { contextArtworkSlugs, slug } = useRoute<ArtworkRoute>().params
  const artworkSlugs = contextArtworkSlugs ?? [slug]

  const screens: ScrollableScreenEntity[] = artworkSlugs.map((slug) => {
    return {
      name: slug,
      Component: () => {
        return (
          <Suspense fallback={<SkeletonArtwork />}>
            <ArtworkPage slug={slug} />
          </Suspense>
        )
      },
    }
  })

  return <PageableScreenView screens={screens} initialScreenName={slug} prefetchScreensCount={5} />
}

export const ArtworkPage: React.FC<{ slug: string }> = ({ slug }) => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { saveNavigationHistory } = useSaveNavigationHistory()
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const artworkData = useSystemQueryLoader<ArtworkQuery>(artworkQuery, {
    slug,
  })
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const { artwork } = artworkData

  const numberOfAlbumsIncludingArtwork = useMemo(() => {
    return filter(albums, { __typename: "Artwork", internalID: artwork?.internalID }).length
  }, [albums, artwork?.internalID])

  const isEditArtworkHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.editArtwork
  )

  const { sendMail } = useMailComposer()

  const addToAlbumHandler = () => {
    saveNavigationHistory("before-adding-to-album")

    navigation.navigate("AddItemsToAlbum", {
      artworkToAdd: artwork as SelectedItem,
      closeBottomSheetModal: () => bottomSheetRef.current?.closeBottomSheetModal(),
    })
  }

  const sendByEmailHandler = async () => {
    if (artwork) {
      await sendMail({ artworks: [artwork as unknown as SelectedItemArtwork] })
    }
  }

  const addToButtonHandler = () => {
    bottomSheetRef.current?.showBottomSheetModal()
  }

  return (
    <BottomSheetModalProvider>
      <Screen>
        <Screen.FloatingHeader
          rightElements={
            <Touchable
              onPress={addToButtonHandler}
              hitSlop={DEFAULT_HIT_SLOP}
              style={{ paddingRight: `${SCREEN_HORIZONTAL_PADDING}%` }}
            >
              <MoreIcon />
            </Touchable>
          }
        />
        <Screen.Body fullwidth safeArea={false}>
          <ArtworkContent artwork={artwork!} />
        </Screen.Body>
      </Screen>

      <BottomSheetModalView
        ref={bottomSheetRef}
        modalHeight={isEditArtworkHidden ? 280 : 380}
        modalRows={
          <>
            <BottomSheetModalRow
              Icon={<EditIcon fill="onBackgroundHigh" />}
              label="Send by Email"
              onPress={sendByEmailHandler}
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
              onPress={addToAlbumHandler}
              isLastRow={isEditArtworkHidden}
            />
          </>
        }
        extraButtons={!isEditArtworkHidden && <EditArtworkInCms slug={slug} />}
      />
    </BottomSheetModalProvider>
  )
}

export const artworkQuery = graphql`
  query ArtworkQuery($slug: String!) {
    artwork(id: $slug) {
      ...Artwork_artworkProps @relay(mask: false)
      ...ArtworkContent_artwork
    }
  }
`

/**
 * Shared fragment to be used whenever we need to display an artwork
 */
// ts-prune-ignore-next
export const Artwork_artworkProps = graphql`
  fragment Artwork_artworkProps on Artwork {
    __typename
    artistNames
    artist {
      imageUrl
    }
    availability
    date
    dimensions {
      in
      cm
    }
    href
    image {
      resized(width: 700, version: "normalized") {
        width
        height
        url
      }
      aspectRatio
    }
    internalID
    medium
    mediumType {
      name
    }
    price
    published
    slug
    title
  }
`

export const SkeletonArtwork = () => {
  return (
    <BottomSheetModalProvider>
      <Screen>
        <Screen.FloatingHeader
          rightElements={
            <Touchable
              hitSlop={DEFAULT_HIT_SLOP}
              style={{ paddingRight: `${SCREEN_HORIZONTAL_PADDING}%` }}
            >
              <MoreIcon />
            </Touchable>
          }
        />
        <Screen.Body fullwidth safeArea={false}>
          <Flex
            backgroundColor="background"
            flex={1}
            justifyContent="center"
            alignItems="center"
            height="78%"
          >
            <ActivityIndicator />
          </Flex>
        </Screen.Body>
      </Screen>

      <BottomSheetModalView
        modalHeight={370}
        modalRows={
          <>
            <BottomSheetModalRow
              Icon={<EditIcon fill="onBackgroundHigh" />}
              label="Send by Email"
              onPress={() => {}}
            />
            <BottomSheetModalRow
              Icon={<BriefcaseIcon fill="onBackgroundHigh" />}
              label="Add to Album"
              onPress={() => {}}
            />
          </>
        }
        extraButtons={<EditArtworkInCms slug="foo" />}
      />
    </BottomSheetModalProvider>
  )
}