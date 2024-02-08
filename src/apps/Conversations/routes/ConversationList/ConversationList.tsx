import { Separator, Tabs } from "@artsy/palette-mobile"
import { ConversationListQuery } from "__generated__/ConversationListQuery.graphql"
import { ConversationListItem } from "apps/Conversations/routes/ConversationList/ConversationListItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { graphql } from "react-relay"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"

export const ConversationList: React.FC = () => {
  useTrackScreen({ name: "ConversationList", type: "Conversation" })

  const partnerId = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  ) as string

  const { data, refreshControl } = useSystemQueryLoader<ConversationListQuery>(
    QUERY,
    {
      partnerId,
      sellerId: partnerId,
    }
  )

  const conversations = extractNodes(data.conversationsConnection)

  if (!conversations.length) {
    return null
  }

  return (
    <Tabs.FlatList
      data={conversations}
      renderItem={({ item }) => <ConversationListItem conversation={item} />}
      ItemSeparatorComponent={() => <Separator my={1} borderColor="black10" />}
      keyExtractor={(item) => item?.internalID as string}
      ListEmptyComponent={<ListEmptyComponent text="No conversations" />}
      refreshControl={refreshControl}
    />
  )
}

const QUERY = graphql`
  query ConversationListQuery($partnerId: String!, $sellerId: ID!) {
    conversationsConnection(first: 30, type: PARTNER, partnerId: $partnerId) {
      edges {
        node {
          ...ConversationListItem_conversation @arguments(sellerId: $sellerId)
          internalID
        }
      }
    }
  }
`
