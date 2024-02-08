import { MessageList_messages$key } from "__generated__/MessageList_messages.graphql"
import { MessageListItem } from "apps/Conversations/routes/Conversation/Messages/MessageListItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { extractNodes } from "utils/extractNodes"

interface MessageListProps {
  conversation: MessageList_messages$key
  refreshControl: JSX.Element | undefined
}

export const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
  const data = useFragment(FRAGMENT, conversation)

  const messages = [...extractNodes(data?.messagesConnection).reverse()]

  return (
    <>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageListItem message={item} />}
        keyExtractor={(item) => item.internalID as string}
        ListEmptyComponent={<ListEmptyComponent text="No messages" />}
      />
    </>
  )
}

const FRAGMENT = graphql`
  fragment MessageList_messages on Conversation {
    messagesConnection(first: 20, sort: DESC) {
      edges {
        node {
          ...MessageListItem_message
          internalID
        }
      }
    }
  }
`
