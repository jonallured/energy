import { createContext, useContext } from "react"
import { ScrollableScreenEntity } from "./types"

export interface ScrollableScreensContextValue {
  activeScreenIndex: number
  activeScreen: ScrollableScreenEntity
}

export const ScrollableScreensContext = createContext(
  null as unknown as ScrollableScreensContextValue
)

export const useScrollableScreensContext = () => {
  const context = useContext<ScrollableScreensContextValue>(ScrollableScreensContext)

  if (!context) {
    throw new Error("useScrollableScreensContext must be inside ScrollableScreensContext.Provider")
  }

  return context
}
