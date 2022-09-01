import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useCallback, useMemo, useRef, useState } from "react"
import { Image, ScrollView } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtworkContentQuery } from "__generated__/ArtworkContentQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { GlobalStore } from "app/store/GlobalStore"
import {
  ArrowRightIcon,
  BriefcaseIcon,
  Flex,
  Separator,
  Spacer,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "palette"
import { HEADER_HEIGHT, ImagePlaceholder, ListEmptyComponent } from "app/sharedUI"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useScreenDimensions } from "shared/hooks"

const BOTTOM_SHEET_HEIGHT = 180

export const ArtworkContent = ({ slug }: { slug: string }) => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const [isScrollEnabled, setIsScrollEnabled] = useState(false)
  const color = useColor()
  const space = useSpace()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const artworkData = useLazyLoadQuery<ArtworkContentQuery>(artworkContentQuery, { slug })

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

  if (!artworkData.artwork) {
    return <ListEmptyComponent />
  }

  // Destructing all the artwork fields here
  const {
    internalID,
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

  const numberOfAlbumsIncludingArtwork = useMemo(() => {
    return albums.filter((album) => album.artworkIds.includes(internalID)).length
  }, [albums])

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
    additionalInformation || shouldDisplayTheDetailBox || !exhibitionHistory || literature

  return (
    <Flex flex={1}>
      <Flex height={imageFlexHeight} px={space(2)}>
        {image?.url ? (
          <Image
            source={{ uri: image?.url }}
            style={{ flex: 1, marginBottom: space(3) }}
            resizeMode="contain"
          />
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
          <Text>{artistNames}</Text>
          <Text italic color="onBackgroundMedium">
            {title}, <Text color="onBackgroundMedium">{date}</Text>
          </Text>
          <Spacer mt={0.5} />
          {isPriceHidden && !price ? null : (
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
          <Spacer mt={2} />
          <Separator />
          {shouldShowAboutTheArtworkTitle ? (
            <>
              <Spacer mt={2} />
              <Text>About the artwork</Text>
              <Spacer mt={1} />
            </>
          ) : null}
          {additionalInformation ? (
            <>
              <Text>{additionalInformation}</Text>
              <Spacer mt={2} />
            </>
          ) : null}
          {shouldDisplayTheDetailBox ? (
            <>
              <Flex px={2} border={1} borderColor="onBackgroundLow">
                <Spacer mt={2} />
                {mediumType?.name ? (
                  <ArtworkDetail label="Medium" value={mediumType?.name} />
                ) : null}
                {conditionDescription?.details ? (
                  <ArtworkDetail label="Condition" value={conditionDescription?.details} />
                ) : null}
                {signature ? <ArtworkDetail label="Signature" value={signature} /> : null}
                {certificateOfAuthenticity?.details ? (
                  <ArtworkDetail
                    label="Certificate of Authenticity"
                    value={certificateOfAuthenticity?.details}
                  />
                ) : null}
                {framed?.details ? <ArtworkDetail label="Frame" value={framed?.details} /> : null}
                {series ? <ArtworkDetail label="Series" value={series} /> : null}
                {imageRights ? <ArtworkDetail label="Image Rights" value={imageRights} /> : null}
                {inventoryId ? <ArtworkDetail label="Inventory ID" value={inventoryId} /> : null}
                {confidentialNotes ? (
                  <ArtworkDetail label="Confidential Notes" value={confidentialNotes} />
                ) : null}
                {internalDisplayPrice ? (
                  <ArtworkDetail label="Editions" value={internalDisplayPrice} />
                ) : null}
                {provenance ? <ArtworkDetail label="Provenance" value={provenance} /> : null}
                <Spacer mt={1} />
              </Flex>
              <Spacer mt={2} />
            </>
          ) : null}

          {exhibitionHistory ? (
            <Flex
              px={2}
              pt={2}
              pb={1}
              border={1}
              borderColor="onBackgroundLow"
              borderBottomColor={exhibitionHistory && literature ? "background" : "onBackgroundLow"}
            >
              <ArtworkDetail size="big" label="Exhibition history" value={exhibitionHistory} />
            </Flex>
          ) : null}
          {literature ? (
            <Flex px={2} pt={2} pb={1} border={1} borderColor="onBackgroundLow">
              <ArtworkDetail size="big" label="Bibliography" value={literature} />
            </Flex>
          ) : null}
          <Spacer mt={2} />

          {albums.length !== 0 ? (
            <Touchable
              onPress={() => navigation.navigate("AddArtworkToAlbum", { slug })}
              disabled={numberOfAlbumsIncludingArtwork === albums.length}
            >
              <Spacer mt={3} />
              <Flex flexDirection="row" alignItems="center">
                <BriefcaseIcon fill="onBackgroundHigh" />
                <Flex ml={1}>
                  {numberOfAlbumsIncludingArtwork === albums.length ? null : (
                    <Text>Add to Album</Text>
                  )}
                  {numberOfAlbumsIncludingArtwork === 0 ? null : (
                    <Flex flexDirection="row" alignItems="center">
                      <Text variant="xs" color="onBackgroundMedium">
                        Currently in{" "}
                        {numberOfAlbumsIncludingArtwork === albums.length
                          ? "all albums"
                          : numberOfAlbumsIncludingArtwork === 1
                          ? "1 album"
                          : `${numberOfAlbumsIncludingArtwork} albums`}
                      </Text>
                    </Flex>
                  )}
                </Flex>
                {numberOfAlbumsIncludingArtwork === albums.length ? null : (
                  <ArrowRightIcon ml="auto" fill="onBackgroundHigh" />
                )}
              </Flex>
              <Spacer mt={3} />
            </Touchable>
          ) : null}
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
  query ArtworkContentQuery($slug: String!) {
    artwork(id: $slug) {
      image {
        url
        aspectRatio
      }
      internalID
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
