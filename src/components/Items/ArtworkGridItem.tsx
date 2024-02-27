import {
  CheckCircleFillIcon,
  Flex,
  FlexProps,
  Text,
  Touchable,
  TrashIcon,
} from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$key } from "__generated__/ArtworkGridItem_artwork.graphql"
import { FadeIn } from "components/Animations/FadeIn"
import { AvailabilityDot } from "components/StatusDot"
import { ViewProps } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { CachedImage } from "system/wrappers/CachedImage"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

export interface ArtworkGridItemProps extends FlexProps {
  artwork: SelectedItemArtwork
  onPress?: () => void
  selectedToAdd?: boolean
  selectedToRemove?: boolean
  disable?: boolean
  style?: ViewProps["style"]
}

export const ArtworkGridItem: React.FC<ArtworkGridItemProps> = ({
  artwork,
  disable,
  selectedToAdd,
  selectedToRemove,
  onPress,
  style,
  ...flexProps
}) => {
  const fontSize = isTablet() ? "sm" : "xs"

  const isDarkMode = useIsDarkMode()

  const isAvailabilityHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.worksAvailability
  )

  const selectedOpacity = (() => {
    if (disable || selectedToAdd || selectedToRemove) {
      return isDarkMode ? 0.6 : 0.4
    }

    return 1
  })()

  return (
    <Touchable
      disabled={disable}
      onPress={onPress}
      data-testID="ArtworkGridItem"
    >
      <Flex {...flexProps} mb={2} opacity={selectedOpacity} style={style}>
        <CachedImage
          uri={artwork.image?.resized?.url}
          aspectRatio={artwork.image?.aspectRatio}
        />

        <Text italic variant={fontSize} color="onBackgroundMedium" mt={1}>
          {!isAvailabilityHidden && (
            <AvailabilityDot availability={artwork.availability} />
          )}{" "}
          {artwork.title}
          {!!artwork.date && (
            <>
              ,{" "}
              <Text variant={fontSize} color="onBackgroundMedium">
                {artwork.date}
              </Text>
            </>
          )}
        </Text>
      </Flex>
      {!disable && !selectedToRemove && !!selectedToAdd && (
        <Flex
          position="absolute"
          top={0.5}
          right={0.5}
          alignItems="center"
          justifyContent="center"
        >
          <FadeIn>
            <CheckCircleFillIcon
              height={30}
              width={30}
              fill={isDarkMode ? "black15" : "blue100"}
            />
          </FadeIn>
        </Flex>
      )}
      {!!selectedToRemove && (
        <Flex position="absolute" alignItems="center" top={0.5} right={0.5}>
          <FadeIn>
            <Flex
              p={0.5}
              borderRadius="50px"
              justifyContent="center"
              backgroundColor="red100"
            >
              <TrashIcon height={20} width={20} fill="onBackgroundHigh" />
            </Flex>
          </FadeIn>
        </Flex>
      )}
    </Touchable>
  )
}

export const ArtworkGridItemFragmentContainer: React.FC<
  ArtworkGridItemProps & {
    artwork: ArtworkGridItem_artwork$key
  }
> = (props) => {
  const artwork = useFragment<ArtworkGridItem_artwork$key>(
    ArtworkGridItemFragment,
    props.artwork
  )
  return (
    <ArtworkGridItem
      {...props}
      artwork={artwork as unknown as SelectedItemArtwork}
    />
  )
}

export const ArtworkGridItemFragment = graphql`
  fragment ArtworkGridItem_artwork on Artwork {
    ...Artwork_artworkProps @relay(mask: false)
  }
`
