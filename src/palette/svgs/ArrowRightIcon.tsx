import { useColor } from "palette/hooks"
import { Icon, IconProps, Path } from "./Icon"

export const ArrowRightIcon = ({ fill, ...restProps }: IconProps) => {
  const color = useColor()
  return (
    <Icon {...restProps} viewBox="0 0 18 18">
      <Path
        d="M5.94 15.94l-.88-.88L11.12 9 5.06 2.94l.88-.88L12.88 9z"
        fill={color(fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
