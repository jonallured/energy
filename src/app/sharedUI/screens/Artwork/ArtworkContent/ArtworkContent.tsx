import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useCallback, useMemo, useRef, useState } from "react"
import { Image } from "react-native"
import QRCode from "react-native-qrcode-generator"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtworkContentQuery } from "__generated__/ArtworkContentQuery.graphql"
import { HEADER_HEIGHT, ImagePlaceholder, ListEmptyComponent, ImageModal } from "app/sharedUI"
import { Markdown } from "app/sharedUI/molecules/Markdown"
import { GlobalStore } from "app/store/GlobalStore"
import { imageSize } from "app/utils/imageSize"
import { Flex, Separator, Spacer, Text, Touchable, useColor, useSpace } from "palette"
import { useScreenDimensions } from "shared/hooks"

const BOTTOM_SHEET_HEIGHT = 180

export const ArtworkContent = ({ slug }: { slug: string }) => {
  const [isScrollEnabled, setIsScrollEnabled] = useState(false)
  const color = useColor()
  const space = useSpace()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const artworkData = useLazyLoadQuery<ArtworkContentQuery>(artworkContentQuery, {
    slug,
    imageSize,
  })

  const screenHeight = useScreenDimensions().height
  const imageFlexHeight = screenHeight - BOTTOM_SHEET_HEIGHT - HEADER_HEIGHT

  const snapPoints = useMemo(() => [BOTTOM_SHEET_HEIGHT, "98%"], [screenHeight])

  // Enable scroll only when the bottom sheet is expanded.
  const handleSheetChanges = useCallback((index: number) => {
    setIsScrollEnabled(!!index)
  }, [])

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  // For Presentation Mode
  const isPriceHidden = GlobalStore.useAppState((state) => state.presentationMode.hiddenItems.price)
  const showQRCode = GlobalStore.useAppState(
    (state) => state.presentationMode.isPresenationModeEnabled
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
    provenance,
    exhibitionHistory,
    literature,
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
    internalDisplayPrice ||
    provenance

  const shouldShowAboutTheArtworkTitle =
    additionalInformation || shouldDisplayTheDetailBox || exhibitionHistory || literature

  return (
    <Flex flex={1}>
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
            <Image
              source={{ uri: image.resized.url }}
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
              backgroundColor="background"
            >
              <Flex width={30} height={4} backgroundColor="onBackgroundMedium" borderRadius={10} />
            </Flex>
          </Touchable>
        )}
        backgroundStyle={{ borderTopWidth: 1, borderColor: color("black10") }}
        style={{ shadowColor: "black", shadowOpacity: 0.08, shadowRadius: 5 }}
      >
        <BottomSheetScrollView
          style={{ paddingHorizontal: space(2), backgroundColor: color("background") }}
          scrollEnabled={isScrollEnabled}
        >
          <Flex flexDirection="row">
            {showQRCode && (
              <Flex style={{ marginRight: 20 }}>
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
                    , <Text color="onBackgroundMedium">{date}</Text>
                  </>
                )}
              </Text>
              <Spacer mt={0.5} />
              {!(isPriceHidden && !price) && (
                <>
                  <Text weight="medium">{price}</Text>
                  <Spacer mt={0.5} />
                </>
              )}
              <Text variant="xs" color="onBackgroundMedium">
                {medium}
              </Text>
              {(dimensions?.in || dimensions?.cm) && (
                <Text variant="xs" color="onBackgroundMedium">
                  {dimensions?.in} - {dimensions?.cm}
                </Text>
              )}
            </Flex>
          </Flex>
          {!!shouldShowAboutTheArtworkTitle && (
            <>
              <Spacer mt={2} />
              <Separator />
              <Spacer mt={2} />
              <Text>About the artwork</Text>
              <Spacer mt={1} />
            </>
          )}
          {!!additionalInformation && (
            <>
              <Markdown>{additionalInformation}</Markdown>
              <Spacer mt={2} />
            </>
          )}
          {!!shouldDisplayTheDetailBox && (
            <>
              <Flex px={2} border={1} borderColor="onBackgroundLow">
                <Spacer mt={2} />
                {!!mediumType?.name && <ArtworkDetail label="Medium" value={mediumType?.name} />}
                {!!conditionDescription?.details && (
                  <ArtworkDetail label="Condition" value={conditionDescription?.details} />
                )}
                {!!signature && <ArtworkDetail label="Signature" value={signature} />}
                {!!certificateOfAuthenticity?.details && (
                  <ArtworkDetail
                    label="Certificate of Authenticity"
                    value={certificateOfAuthenticity?.details}
                  />
                )}
                {!!framed?.details && <ArtworkDetail label="Frame" value={framed?.details} />}
                {!!series && <ArtworkDetail label="Series" value={series} />}
                {!!imageRights && <ArtworkDetail label="Image Rights" value={imageRights} />}
                {!!inventoryId && <ArtworkDetail label="Inventory ID" value={inventoryId} />}
                {!!confidentialNotes && (
                  <ArtworkDetail label="Confidential Notes" value={confidentialNotes} />
                )}
                {!!internalDisplayPrice && (
                  <ArtworkDetail label="Editions" value={internalDisplayPrice} />
                )}
                {!!provenance && <ArtworkDetail label="Provenance" value={provenance} />}
                <Spacer mt={1} />
              </Flex>
              <Spacer mt={2} />
            </>
          )}

          {!!exhibitionHistory && (
            <Flex
              px={2}
              pt={2}
              pb={1}
              border={1}
              borderColor="onBackgroundLow"
              borderBottomColor={exhibitionHistory && literature ? "background" : "onBackgroundLow"}
            >
              <ArtworkDetail label="Exhibition history" value={exhibitionHistory} />
            </Flex>
          )}
          {!!literature && (
            <Flex px={2} pt={2} pb={1} border={1} borderColor="onBackgroundLow">
              <ArtworkDetail label="Bibliography" value={literature} />
            </Flex>
          )}
          <Spacer mt={2} />
        </BottomSheetScrollView>
      </BottomSheet>
    </Flex>
  )
}

interface ArtworkDetailProps {
  size?: "big" | "small"
  label: string
  value: string
}

const ArtworkDetail = ({ size = "small", label, value }: ArtworkDetailProps) => {
  return (
    <>
      <Text variant={size === "big" ? "sm" : "xs"}>{label}</Text>
      <Text variant={size === "big" ? "sm" : "xs"} color="onBackgroundMedium">
        {value}
      </Text>
      <Spacer mt={1} />
    </>
  )
}

const artworkContentQuery = graphql`
  query ArtworkContentQuery($slug: String!, $imageSize: Int!) {
    artwork(id: $slug) {
      image {
        resized(width: $imageSize, version: "normalized") {
          url
        }
        aspectRatio
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
      confidentialNotes
      internalDisplayPrice
      additionalInformation
    }
  }
`
