import { useScreenDimensions } from "@artsy/palette-mobile"

export const useDeviceOrientation = () => {
  const screenDimensions = useScreenDimensions()

  const isLandscape = () => {
    return screenDimensions.width > screenDimensions.height
  }

  const isPortrait = () => {
    return screenDimensions.width < screenDimensions.height
  }

  return {
    isLandscape,
    isPortrait,
  }
}
