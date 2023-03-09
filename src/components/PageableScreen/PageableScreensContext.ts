import { createContext, useContext } from "react"

export type ScrollableScreenEntity = {
  Component: React.FC<any>
  name: string
}

export interface PageableScreensContextValue {
  activeScreenIndex: number
  activeScreen: ScrollableScreenEntity
}

export const PageableScreensContext = createContext(null as unknown as PageableScreensContextValue)

// ts-prune-ignore-next
export const usePageableScreensContext = () => {
  const context = useContext<PageableScreensContextValue>(PageableScreensContext)

  if (!context) {
    throw new Error("usePageableScreensContext must be inside PageableScreensContext.Provider")
  }

  return context
}
