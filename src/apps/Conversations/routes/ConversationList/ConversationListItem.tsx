import {
  Box,
  Flex,
  Text,
  Touchable,
  Image,
  SkeletonBox,
} from "@artsy/palette-mobile"
import { ConversationListItem_conversation$key } from "__generated__/ConversationListItem_conversation.graphql"
import { graphql, useFragment } from "react-relay"
import { useRouter } from "system/hooks/useRouter"
import { extractNodes } from "utils/extractNodes"

interface ConversationListItemProps {
  conversation: ConversationListItem_conversation$key
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
}) => {
  const { router } = useRouter()

  const data = useFragment(FRAGMENT, conversation)

  const item = data?.items?.[0]?.item

  if (!item || item.__typename !== "Artwork") {
    return null
  }

  const orders = extractNodes(data?.orderConnection)

  const conversationType = (() => {
    if (orders.length === 0) {
      return "Inquiry"
    } else if (orders[0].__typename === "CommerceBuyOrder") {
      return "Order"
    } else {
      return "Offer"
    }
  })()

  return (
    <Touchable
      onPress={() => {
        router.navigate("Conversation", {
          internalID: data.internalID as string,
        })
      }}
    >
      <Flex flexDirection="row" alignItems="center" justifyContent="center">
        {item.image?.url ? (
          <Image
            key={item.image?.url}
            src={item.image?.url}
            height={60}
            width={60}
          />
        ) : (
          <SkeletonBox width={50} height={50} />
        )}

        <Flex mx={1} flex={1} overflow="hidden">
          <Box>
            <Text variant="sm" ellipsizeMode="tail">
              {data?.from?.name}
            </Text>

            {!!data.fromProfile?.confirmedBuyerAt && (
              <Box ml={0.5}>
                {/* <UserVerifiedIcon data-testid="user-verified-icon" /> */}
              </Box>
            )}
          </Box>

          <Text variant="xs" ellipsizeMode="tail">
            {item.artist.name}
          </Text>

          <Text variant="xs" color="black60" ellipsizeMode="tail">
            <Text fontStyle="italic" variant="xs">
              {item.title}
            </Text>

            {!!item.date && `, ${item.date}`}
          </Text>
        </Flex>

        <Flex flexDirection="column" alignSelf="flex-start">
          <Text variant="xs">{conversationType}</Text>

          <Flex flexDirection="row" alignItems="center">
            {!!data.unreadByPartner && (
              <Box
                size={6}
                backgroundColor="blue100"
                // borderRadius="50%"
                mr={1}
              />
            )}

            <Text variant="xs" color="black60">
              {data?.lastMessageAt}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Touchable>
  )
}

const FRAGMENT = graphql`
  fragment ConversationListItem_conversation on Conversation
  @argumentDefinitions(sellerId: { type: "ID!" }) {
    internalID
    from {
      name
    }
    fromProfile {
      confirmedBuyerAt
    }
    lastMessageAt(format: "MMM D")
    unreadByPartner

    orderConnection(
      last: 1
      states: [APPROVED, FULFILLED, SUBMITTED, PROCESSING_APPROVAL, REFUNDED]
      sellerId: $sellerId
    ) {
      edges {
        node {
          __typename
        }
      }
    }

    items {
      item @required(action: NONE) {
        __typename
        ... on Artwork {
          internalID
          title @required(action: NONE)
          date
          artist @required(action: NONE) {
            name @required(action: NONE)
          }
          image {
            url(version: ["small", "square"])
          }
        }
      }
    }
  }
`
