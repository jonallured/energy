import { BriefcaseIcon, Button, EnvelopeIcon, Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import * as MailComposer from "expo-mail-composer"
import { useRef } from "react"
import { Tabs } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistTabsQuery } from "__generated__/ArtistTabsQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { useNavigationSave } from "app/navigation/navAtoms"
import { useSystemQueryLoader } from "app/relay/useSystemQueryLoader"
import {
  BottomSheetModalRow,
  BottomSheetModalView,
  BottomSheetRef,
} from "app/sharedUI/molecules/BottomSheetModalView"
import { GlobalStore } from "app/store/GlobalStore"
import { useHeaderSelectModeConfig } from "app/store/selectModeAtoms"
import { imageSize } from "app/utils/imageSize"
import { SuspenseWrapper } from "app/wrappers"
import { ErrorBoundary } from "app/wrappers/ErrorBoundary"
import { Screen } from "palette"
import { extractNodes } from "shared/utils"
import { ArtistArtworks } from "./ArtistArtworks/ArtistArtworks"
import { ArtistDocuments } from "./ArtistDocuments/ArtistDocuments"
import { ArtistShows } from "./ArtistShows/ArtistShows"

type ArtistTabsRoute = RouteProp<NavigationScreens, "ArtistTabs">

export const ArtistTabs = () => {
  const { slug } = useRoute<ArtistTabsRoute>().params
  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const bottomSheetRef = useRef<BottomSheetRef>(null)

  const saveNavBeforeAddingToAlbum = useNavigationSave("before-adding-to-album")

  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const selectedWorks = GlobalStore.useAppState((state) => state.selectMode.artworks)
  const selectedDocs = GlobalStore.useAppState((state) => state.selectMode.documents)
  const selectedItems = GlobalStore.useAppState((state) => state.selectMode.items)

  const oneArtworkSubject = GlobalStore.useAppState((state) => state.email.oneArtworkSubject)
  const multipleArtworksBySameArtistSubject = GlobalStore.useAppState(
    (state) => state.email.multipleArtworksBySameArtistSubject
  )

  const artworkData = useSystemQueryLoader<ArtistTabsQuery>(artistTabsQuery, {
    partnerID,
    artworkIDs: selectedWorks,
    slug,
    imageSize,
  })

  const artworkInfo = extractNodes(artworkData.partner?.artworksConnection)

  const addToButtonHandler = () => {
    bottomSheetRef.current?.showBottomSheetModal()
  }

  const closeBottomSheetModal = () => {
    bottomSheetRef.current?.closeBottomSheetModal()
  }

  const selectModeConfig = useHeaderSelectModeConfig()

  return (
    <BottomSheetModalProvider>
      <Screen>
        <Screen.AnimatedTitleHeader
          title={artworkData.artist?.name ?? ""}
          selectModeConfig={selectModeConfig}
        />
        <Screen.AnimatedTitleTabsBody>
          <Tabs.Tab name="ArtistArtworks" label="Works">
            <ErrorBoundary withoutBackButton>
              <SuspenseWrapper withTabs>
                <ArtistArtworks slug={slug} />
              </SuspenseWrapper>
            </ErrorBoundary>
          </Tabs.Tab>
          <Tabs.Tab name="ArtistShows" label="Shows">
            <ErrorBoundary withoutBackButton>
              <SuspenseWrapper withTabs>
                <ArtistShows slug={slug} />
              </SuspenseWrapper>
            </ErrorBoundary>
          </Tabs.Tab>
          <Tabs.Tab name="ArtistDocuments" label="Documents">
            <ErrorBoundary withoutBackButton>
              <SuspenseWrapper withTabs>
                <ArtistDocuments slug={slug} />
              </SuspenseWrapper>
            </ErrorBoundary>
          </Tabs.Tab>
        </Screen.AnimatedTitleTabsBody>
      </Screen>

      {selectedItems.length > 0 && (
        <Flex
          position="absolute"
          bottom={0}
          px={2}
          pt={1}
          backgroundColor="background"
          pb={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 2}
          width="100%"
        >
          <Text variant="xs" color="primary" mb={1} textAlign="center">
            Selected items: {selectedItems.length}
          </Text>
          <Button block onPress={addToButtonHandler}>
            Add to ...
          </Button>
        </Flex>
      )}

      <BottomSheetModalView
        ref={bottomSheetRef}
        modalHeight={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom + 230 : 250}
        modalRows={
          <>
            <BottomSheetModalRow
              Icon={<BriefcaseIcon fill="onBackgroundHigh" />}
              label="Add to Album"
              onPress={() => {
                saveNavBeforeAddingToAlbum()
                navigation.navigate("AddItemsToAlbum", { closeBottomSheetModal })
              }}
            />
            <BottomSheetModalRow
              Icon={<EnvelopeIcon fill="onBackgroundHigh" />}
              label="Share by Email"
              onPress={() => {
                if (selectedWorks.length == 1) {
                  const { title, artistNames, price, medium, mediumType, dimensions, image, date } =
                    artworkInfo[0]!
                  console.log(title, artistNames, artworkInfo[0])
                  const bodyHTML = `
                    <html>
                      <body>
                        <img
                          height="60%"
                          src="${image?.resized?.url ? image?.resized?.url : ""}"
                        />
                        <h1>${artistNames ?? ""}</h1>
                        <p>${title ?? ""}, ${date ? date : ""}</p>
                        <p>${price ?? ""}</p>
                        <p>${mediumType?.name ?? ""}</p>
                        <p>${medium ?? ""}</p>
                        <p>${dimensions?.cm ?? ""}</p>
                      </body>
                    </html>
                      `
                  MailComposer.composeAsync({
                    subject: oneArtworkSubject
                      .replace("$title", title ?? "")
                      .replace("$artist", artistNames ?? ""),
                    isHtml: true,
                    body: bodyHTML,
                  })
                    .then(() => {})
                    .catch((err) => {
                      console.log("err", err)
                    })
                } else if (selectedWorks.length > 1) {
                  const artistNames = artworkInfo[0].artistNames
                  //construct many artworks part
                  let artworksInfoInHTML = ""

                  artworkInfo.map((artwork) => {
                    const { title, price, medium, mediumType, dimensions, image, date } = artwork
                    artworksInfoInHTML += `
                      <img
                      height="60%"
                      src="${image?.resized?.url ?? ""}"
                      />
                      <p>${title ?? ""}, ${date ?? ""}</p>
                      <p>${price ?? ""}</p>
                      <p>${mediumType?.name ?? ""}</p>
                      <p>${medium ?? ""}</p>
                      <p>${dimensions?.cm ?? ""}</p>
                      `
                  })
                  const bodyHTML = `
                    <html>
                      <body>
                        <h1>${artistNames ?? ""}</h1>
                        ${artworksInfoInHTML}
                      </body>
                    </html>
                      `

                  MailComposer.composeAsync({
                    subject: multipleArtworksBySameArtistSubject.replace(
                      "$artist",
                      artistNames ?? ""
                    ),
                    isHtml: true,
                    body: bodyHTML,
                  })
                    .then(() => {})
                    .catch((err) => {
                      console.log("err", err)
                    })
                }
              }}
              isLastRow
            />
          </>
        }
      />
    </BottomSheetModalProvider>
  )
}

export const artistTabsQuery = graphql`
  query ArtistTabsQuery(
    $partnerID: String!
    $artworkIDs: [String]
    $slug: String!
    $imageSize: Int!
  ) {
    artist(id: $slug) {
      name
    }
    partner(id: $partnerID) {
      artworksConnection(first: 3, artworkIDs: $artworkIDs, includeUnpublished: true) {
        edges {
          node {
            artistNames
            internalID
            title
            image {
              resized(width: $imageSize, version: "normalized") {
                url
              }
            }
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
      }
    }
  }
`
