import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { ShowListItem_show$key } from "__generated__/ShowListItem_show.graphql"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"
import { useRouter } from "system/hooks/useRouter"
import { GlobalStore } from "system/store/GlobalStore"
import { CachedImage } from "system/wrappers/CachedImage"

interface ShowListItemProps {
  show: ShowListItem_show$key
  disabled?: boolean
}

export const ShowListItem: React.FC<ShowListItemProps> = (props) => {
  const show = useFragment<ShowListItem_show$key>(
    ShowListItemFragment,
    props.show
  )

  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )

  const { router } = useRouter()
  const screenWidth = useWindowDimensions().width

  const margin = 20

  return (
    <Touchable
      onPress={() =>
        router.navigate("ShowTabs", {
          slug: show.slug,
        })
      }
      style={{
        width: isTablet() ? (screenWidth - margin * 3) / 2 : undefined,
      }}
      disabled={isSelectModeActive}
    >
      <Flex
        mb={2}
        opacity={props.disabled ? 0.4 : 1}
        overflow="hidden"
        height={260}
      >
        <CachedImage
          uri={show?.coverImage?.url as string}
          resizeMode="cover"
          backgroundColor="transparent"
          width="100%"
          height={200}
          style={{ maxHeight: 200 }}
          placeholderHeight={200}
          aspectRatio={null}
        />
        <Flex width="100%">
          {!!show?.name && (
            <Text variant="sm" mt={1}>
              {show.name}
            </Text>
          )}
          <Text variant="xs" color="onBackgroundMedium">
            {show.formattedStartAt} - {show.formattedEndAt}
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  )
}

const ShowListItemFragment = graphql`
  fragment ShowListItem_show on Show {
    name
    slug
    formattedStartAt: startAt(format: "MMMM D")
    formattedEndAt: endAt(format: "MMMM D, YYYY")
    coverImage {
      width
      height
      url
      aspectRatio
    }
  }
`
