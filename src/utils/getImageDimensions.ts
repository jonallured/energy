interface GetImageDimensionsProps {
  width: number
  height: number
  maxHeight: number
}

export const getImageDimensions = ({
  width,
  height,
  maxHeight,
}: GetImageDimensionsProps) => {
  const aspectRatio = width / height

  const newHeight = maxHeight
  const newWidth = newHeight * aspectRatio

  return {
    width: newWidth,
    height: newHeight,
    aspectRatio,
  }
}
