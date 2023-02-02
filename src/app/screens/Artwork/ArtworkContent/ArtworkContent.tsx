import { Spacer, Flex, Separator, Text, Touchable, Join, useTheme } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useCallback, useMemo, useRef, useState } from "react"
import { Linking, Platform } from "react-native"
import QRCode from "react-native-qrcode-generator"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql } from "react-relay"
import { ArtworkContentQuery } from "__generated__/ArtworkContentQuery.graphql"
import { ImageModal } from "app/components/ImageModal"
import { ImagePlaceholder } from "app/components/ImagePlaceholder"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { Markdown } from "app/components/Markdown"
import {
  ArtworkDetail,
  ArtworkDetailLineItem,
} from "app/screens/Artwork/ArtworkContent/ArtworkDetail"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { CachedImage } from "app/system/wrappers/CachedImage"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { imageSize } from "app/utils/imageSize"
import { defaultRules } from "app/utils/renderMarkdown"
import { NAVBAR_HEIGHT } from "palette/organisms/Screen/notExposed/ActualHeader"

const BOTTOM_SHEET_HEIGHT = 180

export const ArtworkContent = ({ slug }: { slug: string }) => {
  const [isScrollEnabled, setIsScrollEnabled] = useState(false)
  const { color, space } = useTheme()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const safeAreaInsets = useSafeAreaInsets()
  const artworkData = useSystemQueryLoader<ArtworkContentQuery>(artworkContentQuery, {
    slug,
    imageSize,
  })

  const markdownRules = defaultRules({
    ruleOverrides: {
      heading: {
        react: (node, output, state) => {
          return (
            <Text mb="1" key={state.key} variant="sm">
              {output(node.content, state)}
            </Text>
          )
        },
      },
      link: {
        react: (node, output, state) => {
          state.withinText = true
          return (
            <Text
              key={state.key}
              testID={`linktext-${state.key}`}
              onPress={() => Linking.openURL(node.target)}
              variant="sm"
              style={{ textDecorationLine: "underline" }}
            >
              {output(node.content, state)}
            </Text>
          )
        },
      },
    },
  })

  const screenHeight = useScreenDimensions().height
  const imageFlexHeight = screenHeight - BOTTOM_SHEET_HEIGHT - NAVBAR_HEIGHT
  const extraAndroidMargin = Platform.OS === "android" ? 40 : 0

  const snapPoints = useMemo(
    () => [
      BOTTOM_SHEET_HEIGHT - extraAndroidMargin,
      screenHeight - NAVBAR_HEIGHT - safeAreaInsets.top - extraAndroidMargin,
    ],
    [safeAreaInsets.top, screenHeight, extraAndroidMargin]
  )

  // Enable scroll only when the bottom sheet is expanded.
  const handleSheetChanges = useCallback((index: number) => {
    setIsScrollEnabled(!!index)
  }, [])

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  // For Presentation Mode
  const isPriceHidden = GlobalStore.useAppState((state) => state.presentationMode.hiddenItems.price)
  const isPriceForSoldWorksHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.priceForSoldWorks
  )
  const isConfidentialNotesHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.confidentialNotes
  )
  const isAvailabilityHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.worksAvailability
  )

  const showQRCode = GlobalStore.useAppState(
    (state) => state.presentationMode.isPresentationModeEnabled
  )

  if (!artworkData.artwork) {
    return <ListEmptyComponent />
  }

  // Destructing all the artwork fields here
  const {
    image,
    artistNames,
    title,
    date,
    price,
    medium,
    dimensions,
    additionalInformation,
    mediumType,
    conditionDescription,
    signature,
    certificateOfAuthenticity,
    framed,
    series,
    imageRights,
    inventoryId,
    confidentialNotes,
    internalDisplayPrice,
    editionSets,
    provenance,
    exhibitionHistory,
    literature,
    availability,
  } = artworkData.artwork

  const shouldDisplayTheDetailBox =
    mediumType ||
    conditionDescription ||
    signature ||
    certificateOfAuthenticity ||
    framed ||
    series ||
    imageRights ||
    inventoryId ||
    confidentialNotes ||
    provenance

  const shouldShowAboutTheArtworkTitle =
    additionalInformation || shouldDisplayTheDetailBox || exhibitionHistory || literature

  const hasEditionSets = !!editionSets?.length

  const renderPrice = (price?: string | null) => {
    if (!price) return null
    if (isPriceHidden) return null
    if (availability === "sold" && isPriceForSoldWorksHidden) return null

    return <Text weight="regular">{price}</Text>
  }

  return (
    <Flex flex={1} mt={safeAreaInsets.top}>
      <ImageModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        uri={image?.resized?.url ?? ""}
      />

      <Flex height={imageFlexHeight} px={space(2)}>
        {image?.resized?.url ? (
          <Touchable
            style={{ width: "100%", height: "100%" }}
            onPress={() => setIsModalVisible(!isModalVisible)}
          >
            <CachedImage
              uri={image?.resized?.url}
              placeholderHeight={image?.resized?.height}
              style={{ flex: 1, width: "100%", marginBottom: space(3) }}
              resizeMode="contain"
            />
          </Touchable>
        ) : (
          <ImagePlaceholder height={400} />
        )}
      </Flex>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleComponent={() => (
          <Touchable onPress={handlePresentModalPress}>
            <Flex
              width="100%"
              height={30}
              alignItems="center"
              justifyContent="center"
              backgroundColor="surface"
              borderTopLeftRadius={10}
              borderTopRightRadius={10}
            >
              <Flex width={30} height={4} backgroundColor="onSurfaceMedium" borderRadius={10} />
            </Flex>
          </Touchable>
        )}
        backgroundStyle={{ borderTopWidth: 1, borderColor: color("black10") }}
        style={{ shadowColor: "black", shadowOpacity: 0.08, shadowRadius: 5 }}
      >
        <BottomSheetScrollView
          style={{
            backgroundColor: color("surface"),
            paddingHorizontal: space(2),
            paddingBottom: space(4),
          }}
          scrollEnabled={isScrollEnabled}
        >
          <Join separator={<Spacer y={1} />}>
            <Flex flexDirection="row">
              {showQRCode && (
                <Flex mr={2}>
                  <QRCode
                    value={`https://artsy.net/artwork/${slug}`}
                    size={100}
                    bgColor="black"
                    fgColor="white"
                  />
                </Flex>
              )}

              <Flex>
                <Text>{artistNames}</Text>

                <Text italic color="onBackgroundMedium">
                  {title}
                  {!!date && (
                    <>
                      , <ArtworkDetailLineItem value={date} />
                    </>
                  )}
                </Text>

                {!hasEditionSets &&
                  (internalDisplayPrice ? renderPrice(internalDisplayPrice) : renderPrice(price))}

                <ArtworkDetailLineItem value={medium} />

                {!hasEditionSets && (dimensions?.in || dimensions?.cm) && (
                  <ArtworkDetailLineItem value={`${dimensions?.in} - ${dimensions?.cm}`} />
                )}

                {hasEditionSets && (
                  <>
                    <Text mt={2} weight="medium">
                      Editions
                    </Text>

                    {editionSets?.map((set, idx) => (
                      <Flex key={`${idx}`}>
                        <ArtworkDetailLineItem value={set?.dimensions?.in} />
                        <ArtworkDetailLineItem value={set?.dimensions?.cm} />
                        <ArtworkDetailLineItem value={set?.editionOf} />

                        {set?.saleMessage !== set?.price && !isAvailabilityHidden && (
                          <ArtworkDetailLineItem value={set?.saleMessage} />
                        )}

                        {set?.internalDisplayPrice
                          ? renderPrice(set?.internalDisplayPrice)
                          : renderPrice(set?.price)}
                      </Flex>
                    ))}
                  </>
                )}
              </Flex>
            </Flex>

            {!!shouldShowAboutTheArtworkTitle && (
              <>
                <Separator my={2} />

                <Text variant="md" mb={1}>
                  About the artwork
                </Text>
              </>
            )}

            {!!additionalInformation && (
              <Markdown rules={markdownRules}>{additionalInformation}</Markdown>
            )}

            {!!shouldDisplayTheDetailBox && (
              <>
                <BorderBox>
                  <ArtworkDetail label="Medium" value={mediumType?.name} />
                  <ArtworkDetail label="Condition" value={conditionDescription?.details} />
                  <ArtworkDetail label="Signature" value={signature} />
                  <ArtworkDetail
                    label="Certificate of Authenticity"
                    value={certificateOfAuthenticity?.details}
                  />
                  <ArtworkDetail label="Frame" value={framed?.details} />
                  <ArtworkDetail label="Series" value={series} />
                  <ArtworkDetail label="Image Rights" value={imageRights} />
                  <ArtworkDetail label="Inventory ID" value={inventoryId} />
                  {!isConfidentialNotesHidden && (
                    <ArtworkDetail label="Confidential Notes" value={confidentialNotes} />
                  )}
                  <ArtworkDetail label="Provenance" value={provenance} />
                </BorderBox>
              </>
            )}

            {!!exhibitionHistory && (
              <BorderBox>
                <ArtworkDetail label="Exhibition history" value={exhibitionHistory} size="big" />
              </BorderBox>
            )}

            {!!literature && (
              <BorderBox>
                <ArtworkDetail label="Bibliography" value={literature} size="big" />
              </BorderBox>
            )}
          </Join>
        </BottomSheetScrollView>
      </BottomSheet>
    </Flex>
  )
}

const BorderBox: React.FC = ({ children }) => {
  return (
    <Flex py={0.5} border={1} borderColor="onSurfaceLow">
      {children}
    </Flex>
  )
}

export const artworkContentQuery = graphql`
  query ArtworkContentQuery($slug: String!, $imageSize: Int!) {
    artwork(id: $slug) {
      image {
        resized(width: $imageSize, version: "normalized") {
          height
          url
        }
        aspectRatio
      }
      artist {
        imageUrl
      }
      title
      price
      date
      medium
      mediumType {
        name
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
      dimensions {
        cm
        in
      }
      inventoryId
      artistNames
      signature
      provenance
      exhibitionHistory
      literature
      imageRights
      series
      certificateOfAuthenticity {
        details
      }
      conditionDescription {
        details
      }
      framed {
        details
      }
      availability
      confidentialNotes
      internalDisplayPrice
      additionalInformation
    }
  }
`
