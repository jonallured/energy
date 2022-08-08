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
import { HEADER_HEIGHT, ImagePlaceholder } from "app/sharedUI"
import BottomSheet from "@gorhom/bottom-sheet"
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
  const numberOfAlbumsTheArtworkAvailable = useMemo(() => {
    return albums.filter((album) => album.artworkIds.includes(artworkData.artwork?.internalID!))
      .length
  }, [albums])

  const screenHeight = useScreenDimensions().height
  const imageFlexHeight = screenHeight - BOTTOM_SHEET_HEIGHT - HEADER_HEIGHT

  const snapPoints = useMemo(() => [BOTTOM_SHEET_HEIGHT, screenHeight], [screenHeight])

  // Enable scroll only when the bottom sheet is expanded.
  const handleSheetChanges = useCallback((index: number) => {
    setIsScrollEnabled(!!index)
  }, [])

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  return (
    <Flex flex={1}>
      <Flex height={imageFlexHeight} px={space(2)}>
        {artworkData.artwork?.image?.url ? (
          <Image
            source={{ uri: artworkData.artwork?.image?.url }}
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
              my={1}
              width={30}
              height={4}
              backgroundColor="black"
              alignSelf="center"
              borderRadius={10}
            />
          </Touchable>
        )}
        backgroundStyle={{ borderTopWidth: 1, borderColor: color("black10") }}
      >
        <ScrollView style={{ paddingHorizontal: space(2) }} scrollEnabled={isScrollEnabled}>
          <Text>{artworkData.artwork?.artist?.name}</Text>
          <Text italic color="black60">
            {artworkData.artwork?.title}, <Text color="black60">{artworkData.artwork?.date}</Text>
          </Text>
          <Spacer mt={0.5} />
          <Text weight="medium">{artworkData.artwork?.price || "$0"}</Text>
          <Spacer mt={0.5} />
          <Text variant="xs" color="black60">
            {artworkData.artwork?.mediumType?.name}
          </Text>
          {(artworkData.artwork?.dimensions?.in || artworkData.artwork?.dimensions?.cm) && (
            <Text variant="xs" color="black60">
              {artworkData.artwork?.dimensions?.in} - {artworkData.artwork?.dimensions?.cm}
            </Text>
          )}
          <Spacer mt={2} />
          <Separator />
          {artworkData.artwork?.inventoryId ? (
            <>
              <Spacer mt={2} />
              <Text variant="xs">Inventory ID</Text>
              <Text variant="xs" color="black60">
                {artworkData.artwork?.inventoryId}
              </Text>
              <Spacer mt={2} />
              <Separator />
            </>
          ) : null}
          {albums.length !== 0 ? (
            <Touchable
              onPress={() => {
                navigation.navigate("AddArtworkToAlbum", { slug })
              }}
              disabled={numberOfAlbumsTheArtworkAvailable === albums.length}
            >
              <Spacer mt={3} />
              <Flex flexDirection="row" alignItems="center">
                <BriefcaseIcon fill="black100" />
                <Flex ml={1}>
                  {numberOfAlbumsTheArtworkAvailable === albums.length ? null : (
                    <Text>Add to Album</Text>
                  )}
                  {numberOfAlbumsTheArtworkAvailable === 0 ? null : (
                    <Flex flexDirection="row" alignItems="center">
                      <Text variant="xs" color="black60">
                        Currently in{" "}
                        {numberOfAlbumsTheArtworkAvailable === albums.length
                          ? "all albums"
                          : numberOfAlbumsTheArtworkAvailable === 1
                          ? "1 album"
                          : `${numberOfAlbumsTheArtworkAvailable} albums`}
                      </Text>
                    </Flex>
                  )}
                </Flex>
                {numberOfAlbumsTheArtworkAvailable === albums.length ? null : (
                  <ArrowRightIcon ml="auto" fill="black100" />
                )}
              </Flex>
              <Spacer mt={3} />
            </Touchable>
          ) : null}
        </ScrollView>
      </BottomSheet>
    </Flex>
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
      mediumType {
        name
      }
      dimensions {
        in
        cm
      }
      inventoryId
      artist {
        name
      }
    }
  }
`
