import Svg, { Path } from "react-native-svg"
import { IconProps } from "palette"

export const TriangleDown = ({ fill, ...restProps }: IconProps) => {
  return (
    <Svg width="11" height="6" {...restProps} viewBox="0 0 11 6" fill="none">
      <Path
        fillRule="evenodd"
        clip-rule="evenodd"
        d="M5.5 6L0 0L11 0L5.5 6Z"
        fill={fill ?? "black"}
      />
    </Svg>
  )
}
