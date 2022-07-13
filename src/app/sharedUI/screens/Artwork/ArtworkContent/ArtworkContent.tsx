import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ArrowRightIcon, BriefcaseIcon, Flex, Separator, Spacer, Text, Touchable } from "palette"
import { useMemo } from "react"
import { Image } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { ArtworkContentQuery } from "__generated__/ArtworkContentQuery.graphql"
import { GlobalStore } from "app/store/GlobalStore"

type ArtworkContentProps = {
  slug: string
}

export const ArtworkContent: React.FC<ArtworkContentProps> = (props) => {
  const { slug } = props
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const artworkData = useLazyLoadQuery<ArtworkContentQuery>(artworkContentQuery, { slug })
  const numberOfAlbumsTheArtworkAvailable = useMemo(() => {
    return albums.filter((album) => album.artworkIds.includes(artworkData.artwork?.internalID!))
      .length
  }, [albums])

  return (
    <Flex>
      <Image
        source={{
          uri: Image.resolveAssetSource({ uri: artworkData.artwork?.image?.url! }).uri,
        }}
        style={{
          aspectRatio: artworkData.artwork?.image?.aspectRatio ?? 1,
        }}
      />
      <Spacer mt={2} />
      <Separator />
      <Spacer mt={2} />
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
