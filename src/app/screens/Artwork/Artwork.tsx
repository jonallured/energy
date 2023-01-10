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
import * as MailComposer from "expo-mail-composer"
import { useMemo, useRef } from "react"
import { ActivityIndicator } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtworkQuery } from "__generated__/ArtworkQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import {
  BottomSheetRef,
  BottomSheetModalView,
  BottomSheetModalRow,
} from "app/components/BottomSheetModalView"
import { ScrollableScreenEntity } from "app/components/ScrollableScreensView/ScrollableScreensContext"
import { ScrollableScreensView } from "app/components/ScrollableScreensView/ScrollableScreensView"
import { GlobalStore } from "app/system/store/GlobalStore"
import { ErrorBoundary } from "app/system/wrappers/ErrorBoundary"
import { SuspenseWrapper } from "app/system/wrappers/SuspenseWrapper"
import { imageSize } from "app/utils/imageSize"
import { Screen } from "palette"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"
import { ArtworkContent } from "./ArtworkContent/ArtworkContent"
import { EditArtworkInCms } from "./EditArtworkInCms"

type ArtworkRoute = RouteProp<NavigationScreens, "Artwork">

export const Artwork = () => {
  const { contextArtworkSlugs, slug } = useRoute<ArtworkRoute>().params
  const artworkSlugs = contextArtworkSlugs ?? [slug]
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const artworkData = useLazyLoadQuery<ArtworkQuery>(artworkQuery, {
    slug,
    imageSize,
  })
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const oneArtworkSubject = GlobalStore.useAppState((state) => state.email.oneArtworkSubject)

  const screens: ScrollableScreenEntity[] = artworkSlugs.map((slug) => ({
    name: slug,
    content: (
      <ErrorBoundary withoutBackButton>
        <SuspenseWrapper key={slug}>
          <ArtworkContent slug={slug} />
        </SuspenseWrapper>
      </ErrorBoundary>
    ),
  }))
  const { artwork } = useLazyLoadQuery<ArtworkQuery>(artworkQuery, {
    slug,
    imageSize,
  })

  const numberOfAlbumsIncludingArtwork = useMemo(() => {
    return albums.filter((album) => album.artworkIds.includes(artworkData.artwork?.internalID!))
      .length
  }, [albums, artworkData.artwork?.internalID])

  const isEditArtworkHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.editArtwork
  )

  const addToButtonHandler = () => {
    bottomSheetRef.current?.showBottomSheetModal()
  }

  const { title, artistNames, price, dimensions, date, image, medium, mediumType } = artwork!

  const bodyHTML = `
<html>
  <body>
    <img
      height="60%"
      src="${image?.resized?.url ? image?.resized?.url : ""}"
    />
    <h1>${artistNames ? artistNames : ""}</h1>
    <p>${title ? title : ""}, ${date ? date : ""}</p>
    <p>${price ? price : ""}</p>
    <p>${mediumType?.name ? mediumType?.name : ""}</p>
    <p>${medium ? medium : ""}</p>
    <p>${dimensions?.cm ? dimensions?.cm : ""}</p>
  </body>
</html>
`
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
          <ScrollableScreensView screens={screens} initialScreenName={slug} />
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
              onPress={() => {
                MailComposer.composeAsync({
                  subject: oneArtworkSubject
                    .replace("$title", title!)
                    .replace("$artist", artistNames!),
                  isHtml: true,
                  body: bodyHTML,
                })
                  .then(() => {})
                  .catch((err) => {
                    console.log("err", err)
                  })
              }}
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
              onPress={() =>
                navigation.navigate("AddItemsToAlbum", {
                  artworkIdToAdd: artwork?.internalID,
                  closeBottomSheetModal: () => bottomSheetRef.current?.closeBottomSheetModal(),
                })
              }
              isLastRow={isEditArtworkHidden}
            />
          </>
        }
        extraButtons={!isEditArtworkHidden && <EditArtworkInCms slug={slug} />}
      />
    </BottomSheetModalProvider>
  )
}

const artworkQuery = graphql`
  query ArtworkQuery($slug: String!, $imageSize: Int!) {
    artwork(id: $slug) {
      image {
        resized(width: $imageSize, version: "normalized") {
          url
        }
      }
      artistNames
      title
      price
      date
      medium
      mediumType {
        name
      }
      dimensions {
        in
        cm
      }
      internalID
    }
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
        // ref={bottomSheetRef}
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
