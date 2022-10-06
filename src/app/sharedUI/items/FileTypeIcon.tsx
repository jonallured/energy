import { useColor, Icon, Path } from "palette"

export const FileTypeIcon = ({ fileType }: { fileType?: string }) => {
  const color = useColor()

  switch (fileType) {
    case "pdf":
      return (
        <Icon viewBox="0 0 24 24" width={50} height={50} testID="acrobat-icon">
          <Path
            d="M10.15 1.095C9.938.33 9.42-.051 8.984.005c-.528.068-1.09.382-1.314.876-.63 1.416.685 5.582.887 6.279-1.28 3.863-5.66 11.5-7.806 12.017-.045-.505.225-1.965 3.055-3.785.146-.157.315-.348.393-.472-2.392 1.168-5.492 3.044-3.628 4.448.102.079.259.146.439.213 1.426.528 3.425-1.201 5.435-5.121 2.213-.73 3.999-1.28 6.526-1.662 2.762 1.875 4.616 2.257 5.874 1.774.348-.135.898-.573 1.055-1.145-1.022 1.258-3.414.382-5.323-.82 1.763-.191 3.582-.303 4.369-.056 1 .314.965.808.954.876.079-.27.191-.708-.022-1.056-.842-1.37-4.706-.573-6.11-.427-2.212-1.336-3.74-3.717-4.358-5.436.573-2.212 1.19-3.818.742-5.413zm-.954 4.638C8.826 4.42 8.309 1.5 9.14.556c1.628.932.618 3.144.056 5.177zm3.044 6.514c-2.134.393-3.583.944-5.66 1.764.617-1.202 1.785-4.268 2.346-6.29.787 1.573 1.741 3.111 3.314 4.526z"
            fill={color("onBackgroundMedium")}
            fillRule="evenodd"
          />
        </Icon>
      )
    case "jpg":
    case "jpeg":
    case "png":
      return (
        <Icon viewBox="0 0 24 24" width={50} height={50} mt={2} testID="image-icon">
          <Path
            d="M13 0L9.25 5l2.85 3.8-1.6 1.2C8.81 7.75 6 4 6 4l-6 8h22L13 0z"
            fill={color("onBackgroundMedium")}
            fillRule="evenodd"
          />
        </Icon>
      )
    default:
      return (
        <Icon viewBox="0 0 24 24" width={50} height={50} mt={2} testID="default-icon">
          <Path
            d="M12 4H0v2h12V4zM0 10h18V8H0v2zM0 0v2h18V0H0z"
            fill={color("onBackgroundMedium")}
            fillRule="evenodd"
          />
        </Icon>
      )
  }
}
