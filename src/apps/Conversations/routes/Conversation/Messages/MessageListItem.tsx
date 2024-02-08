import { Text } from "@artsy/palette-mobile"
import { MessageListItem_message$key } from "__generated__/MessageListItem_message.graphql"
import { graphql, useFragment } from "react-relay"

interface MessageListItem {
  message: MessageListItem_message$key
}

export const MessageListItem: React.FC<MessageListItem> = ({ message }) => {
  const data = useFragment(FRAGMENT, message)

  if (!data) {
    return null
  }

  return <Text>{data.body}</Text>
}

const FRAGMENT = graphql`
  fragment MessageListItem_message on Message {
    id
    internalID
    attachments {
      internalID
      contentType
      downloadURL
      fileName
    }
    body
    createdAt
    createdAtTime: createdAt(format: "h:mmA") @required(action: NONE)
    deliveries @required(action: NONE) {
      openedAt
      fullTransformedEmail
    }
    isFromUser
    isFirstMessage
    from @required(action: NONE) {
      name
    }
    to @required(action: NONE)
    cc @required(action: NONE)
  }
`
