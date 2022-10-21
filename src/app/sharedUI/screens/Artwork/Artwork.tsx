import { ArtworkIcon, EditIcon, BriefcaseIcon, Touchable, MoreIcon } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import * as MailComposer from "expo-mail-composer"
import { useMemo, useRef } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtworkQuery } from "__generated__/ArtworkQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { ScrollableScreenEntity, ScrollableScreensView } from "app/sharedUI"
import {
  BottomSheetModalRow,
  BottomSheetModalView,
  BottomSheetRef,
} from "app/sharedUI/molecules/BottomSheetModalView"
import { GlobalStore } from "app/store/GlobalStore"
import { imageSize } from "app/utils/imageSize"
import { SuspenseWrapper } from "app/wrappers"
import { Screen } from "palette"
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
      <SuspenseWrapper key={slug}>
        <ArtworkContent slug={slug} />
      </SuspenseWrapper>
    ),
  }))
  const { artwork } = useLazyLoadQuery<ArtworkQuery>(artworkQuery, {
    slug,
    imageSize,
  })

  const numberOfAlbumsIncludingArtwork = useMemo(() => {
    return albums.filter((album) => album.artworkIds?.includes(artworkData.artwork?.internalID!))
      .length
  }, [albums])

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
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              <MoreIcon />
            </Touchable>
          }
        />
        <Screen.Body fullwidth>
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
                navigation.navigate("AddArtworksToAlbum", { slug, contextArtworkSlugs })
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
