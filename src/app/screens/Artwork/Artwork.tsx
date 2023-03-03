import {
  ArtworkIcon,
  EditIcon,
  BriefcaseIcon,
  Touchable,
  MoreIcon,
  Flex,
  DEFAULT_HIT_SLOP,
} from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ArtworkQuery, ArtworkQuery$data } from "__generated__/ArtworkQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import {
  BottomSheetRef,
  BottomSheetModalView,
  BottomSheetModalRow,
} from "app/components/BottomSheetModalView"
import { ScrollableScreenEntity } from "app/components/ScrollableScreensView/ScrollableScreensContext"
import { ScrollableScreensView } from "app/components/ScrollableScreensView/ScrollableScreensView"
import { useMailComposer } from "app/screens/Artwork/useMailComposer"
import { useNavigationSave } from "app/system/hooks/useNavigationSave"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItem, SelectedItemArtwork } from "app/system/store/Models/SelectModeModel"
import { imageSize } from "app/utils/imageSize"
import { filter } from "lodash"
import { Screen } from "palette"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"
import { Suspense, useMemo, useRef } from "react"
import { ActivityIndicator } from "react-native"
import { graphql } from "react-relay"
import { ArtworkContent } from "./ArtworkContent/ArtworkContent"
import { EditArtworkInCms } from "./EditArtworkInCms"

type ArtworkRoute = RouteProp<NavigationScreens, "Artwork">

export type ArtworkItemProps = ArtworkQuery$data["artwork"]

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

  return (
    <ScrollableScreensView screens={screens} initialScreenName={slug} prefetchScreensCount={5} />
  )
}

export const ArtworkPage: React.FC<{ slug: string }> = ({ slug }) => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const saveNavBeforeAddingToAlbum = useNavigationSave("before-adding-to-album")
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const artworkData = useSystemQueryLoader<ArtworkQuery>(artworkQuery, {
    slug,
    imageSize,
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
        <Screen.Body fullwidth nosafe>
          <ArtworkContent artwork={artwork!} />
        </Screen.Body>
      </Screen>

      <BottomSheetModalView
        ref={bottomSheetRef}
        modalHeight={!isEditArtworkHidden ? 500 : 370}
        modalRows={
          <>
            <BottomSheetModalRow
              Icon={<ArtworkIcon fill="onBackgroundHigh" />}
              label="View in Room"
              onPress={() => {}}
            />
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
              onPress={() => {
                saveNavBeforeAddingToAlbum()

                navigation.navigate("AddItemsToAlbum", {
                  artworkToAdd: artwork as SelectedItem,
                  closeBottomSheetModal: () => bottomSheetRef.current?.closeBottomSheetModal(),
                })
              }}
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
  query ArtworkQuery($slug: String!, $imageSize: Int!) {
    artwork(id: $slug) {
      ...Artwork_artworkProps @relay(mask: false)
      ...ArtworkContent_artwork @arguments(imageSize: $imageSize)

      image {
        resized(width: $imageSize, version: "normalized") {
          url
        }
      }
    }
  }
`

/**
 * Shared fragment to be used whenever we need to display an artwork
 */
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
        <Screen.Body fullwidth nosafe>
          <Flex backgroundColor="background" flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator />
          </Flex>
        </Screen.Body>
      </Screen>

      <BottomSheetModalView
        modalHeight={370}
        modalRows={
          <>
            <BottomSheetModalRow
              Icon={<ArtworkIcon fill="onBackgroundHigh" />}
              label="View in Room"
              onPress={() => {}}
            />
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
