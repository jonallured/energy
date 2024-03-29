import {
  EditIcon,
  BriefcaseIcon,
  Touchable,
  MoreIcon,
  Screen,
  DEFAULT_HIT_SLOP,
  SCREEN_HORIZONTAL_PADDING,
  Flex,
} from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationRoutes } from "Navigation"
import { ArtworkQuery } from "__generated__/ArtworkQuery.graphql"
import { EditArtworkInCms } from "apps/Artwork/components/EditArtworkInCms"
import {
  BottomSheetRef,
  BottomSheetModalView,
  BottomSheetModalRow,
} from "components/BottomSheet/BottomSheetModalView"
import { PageableScreenView } from "components/PageableScreen/PageableScreenView"
import {
  ScrollableScreenEntity,
  usePageableScreensContext,
} from "components/PageableScreen/PageableScreensContext"
import React, { Suspense, useEffect, useMemo, useRef } from "react"
import { graphql } from "react-relay"
import { useSaveNavigationHistory } from "system/hooks/useNavigationHistory"
import { useRouter } from "system/hooks/useRouter"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import {
  SelectedItem,
  SelectedItemArtwork,
} from "system/store/Models/SelectModeModel"
import { useMailComposer } from "utils/hooks/useMailComposer"
import { waitForScreenTransition } from "utils/waitForScreenTransition"
import { ArtworkContent } from "./ArtworkContent/ArtworkContent"

type ArtworkRoute = RouteProp<NavigationRoutes, "Artwork">

export const Artwork: React.FC = () => {
  const { contextArtworkSlugs, slug } = useRoute<ArtworkRoute>().params
  const { router } = useRouter()
  const actionMenuHandler = useRef<any>(null)
  const artworkSlugs = contextArtworkSlugs ?? [slug]

  useTrackScreen({
    name: "Artwork",
    type: "Artwork",
    slug,
  })

  const screens: ScrollableScreenEntity[] = useMemo(
    () =>
      artworkSlugs.map((slug, index) => {
        return {
          name: slug,
          Component: () => {
            return (
              <Suspense fallback={<SkeletonArtwork />}>
                <ArtworkPage
                  slug={slug}
                  screenIndex={index}
                  onRender={(handler) => {
                    actionMenuHandler.current = handler
                  }}
                />
              </Suspense>
            )
          },
        }
      }),
    []
  )

  return (
    <Screen safeArea={false}>
      <Screen.FloatingHeader
        onBack={router.goBack}
        rightElements={
          <Touchable
            onPress={() => actionMenuHandler?.current()}
            hitSlop={DEFAULT_HIT_SLOP}
            style={{ paddingRight: `${SCREEN_HORIZONTAL_PADDING}%` }}
          >
            <MoreIcon />
          </Touchable>
        }
      />
      <PageableScreenView
        screens={screens}
        initialScreenName={slug}
        prefetchScreensCount={5}
      />
    </Screen>
  )
}

interface ArtworkPageProps {
  slug: string
  screenIndex: number
  onRender: (handler: () => void) => void
}

export const ArtworkPage: React.FC<ArtworkPageProps> = ({
  slug,
  screenIndex,
  onRender,
}) => {
  const { router } = useRouter()
  const { saveNavigationHistory } = useSaveNavigationHistory()
  const { activeScreenIndex } = usePageableScreensContext()

  const bottomSheetRef = useRef<BottomSheetRef>(null)

  const { data } = useSystemQueryLoader<ArtworkQuery>(artworkQuery, {
    slug,
  })

  const albums = GlobalStore.useAppState((state) => state.albums.albums)

  const { artwork } = data

  const numberOfAlbumsIncludingArtwork = albums
    .flatMap((album) => album.items)
    .filter((item) => {
      return item?.internalID === artwork?.internalID
    }).length

  const isEditArtworkHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.editArtwork
  )

  const { sendMail } = useMailComposer()

  const addToAlbumHandler = () => {
    saveNavigationHistory("before-adding-to-album")

    router.navigate("AddItemsToAlbum", {
      artworksToAdd: [artwork] as SelectedItem[],
    })

    waitForScreenTransition(() => {
      bottomSheetRef.current?.closeBottomSheetModal()
    })
  }

  const sendByEmailHandler = async () => {
    if (artwork) {
      await sendMail({
        artworks: [artwork as unknown as SelectedItemArtwork],
        type: "Artwork",
      })
    }
  }

  const actionMenuHandler = () => {
    bottomSheetRef.current?.showBottomSheetModal()
  }

  /**
   * When the screen is visible, pass the action button handler up to parent
   * so that we can trigger the modal action items
   */
  useEffect(() => {
    if (activeScreenIndex === screenIndex) {
      onRender(actionMenuHandler)
    }
  }, [activeScreenIndex])

  return (
    <BottomSheetModalProvider>
      <Screen safeArea={false}>
        <Screen.Body fullwidth>
          <ArtworkContent artwork={artwork!} />
        </Screen.Body>
      </Screen>

      <BottomSheetModalView
        ref={bottomSheetRef}
        modalHeight={isEditArtworkHidden ? 280 : 380}
        modalRows={
          <>
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
            <BottomSheetModalRow
              Icon={<EditIcon fill="onBackgroundHigh" />}
              label="Send by Email"
              onPress={sendByEmailHandler}
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
      image {
        resized(width: 100, height: 100) {
          url
        }
      }
    }
    availability
    date
    dimensions {
      in
      cm
    }
    editionSets {
      dimensions {
        cm
        in
      }
      editionOf
      saleMessage
      internalDisplayPrice
      price
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
      <Screen safeArea={false}>
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
        <Screen.Body fullwidth>
          <Flex flex={1} />
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
