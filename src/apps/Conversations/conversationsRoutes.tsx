import { StackNav } from "Navigation"
import { Conversation } from "apps/Conversations/routes/Conversation/Conversation"
import { ConversationList } from "apps/Conversations/routes/ConversationList/ConversationList"
import { Suspense } from "react"
import { RetryErrorBoundary } from "system/wrappers/RetryErrorBoundary"

export type ConversationsRoutes = {
  ConversationList: {}
  Conversation: { internalID: string }
}

export const ConversationsRouter = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen
        name="ConversationList"
        children={() => (
          <RetryErrorBoundary>
            <Suspense fallback={null}>
              <ConversationList />
            </Suspense>
          </RetryErrorBoundary>
        )}
      />
      <StackNav.Screen
        name="Conversation"
        children={() => (
          <RetryErrorBoundary>
            <Suspense fallback={null}>
              <Conversation />
            </Suspense>
          </RetryErrorBoundary>
        )}
      />
    </StackNav.Group>
  )
}
