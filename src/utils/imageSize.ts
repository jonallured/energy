import { Dimensions, PixelRatio } from "react-native"

const windowWidth = Dimensions.get("window").width
const pixelRatio = PixelRatio.get()

export const imageSize = 2 * windowWidth * pixelRatio
