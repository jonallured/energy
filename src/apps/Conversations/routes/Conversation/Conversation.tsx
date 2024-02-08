import { Screen, Text } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationRoutes } from "Navigation"
import { ConversationQuery } from "__generated__/ConversationQuery.graphql"
import { MessageList } from "apps/Conversations/routes/Conversation/Messages/MessageList"
import { graphql } from "react-relay"
import { useRouter } from "system/hooks/useRouter"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"

type ConversationRoute = RouteProp<NavigationRoutes, "Conversation">

export const Conversation: React.FC = () => {
  useTrackScreen({ name: "Conversation", type: "Conversation" })

  const { router } = useRouter()
  const { internalID } = useRoute<ConversationRoute>().params

  const { data, refreshControl } = useSystemQueryLoader<ConversationQuery>(
    QUERY,
    {
      id: internalID,
    }
  )

  if (!data.conversation) {
    return null
  }

  return (
    <>
      <Screen>
        <Screen.Header
          title={data.conversation?.from.name}
          onBack={router.goBack}
        />
        <Text>Conversation</Text>

        <MessageList
          conversation={data.conversation}
          refreshControl={refreshControl}
        />
      </Screen>
    </>
  )
}

const QUERY = graphql`
  query ConversationQuery($id: String!) {
    conversation(id: $id) {
      ...MessageList_messages
      internalID
      from {
        name
      }
    }
  }
`
