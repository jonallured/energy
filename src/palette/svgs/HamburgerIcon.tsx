import { useColor } from "palette/hooks"
import { Icon, IconProps, Path } from "./Icon"

export const HamburgerIcon = ({ fill, ...restprops }: IconProps) => {
  const color = useColor()
  return (
    <Icon {...restprops} viewBox="0 0 18 18">
      <Path
        d="
		M 0,3
		H 12
		v 1
		H 0
		V 0
		Z
		m 0,6
		H 12
		v 1
		H 0
		V 0
		Z
		m 0,6
		H 12
		v 1
		H 0
		V 0
		Z
		"
        fill={color(fill)}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Icon>
  )
}
