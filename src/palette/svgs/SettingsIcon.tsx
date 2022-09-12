import { useColor } from "palette/hooks"
import { Icon, IconProps, Path } from "./Icon"

export const SettingsIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M8.24279 1.5C7.88639 1.5 7.57156 1.73218 7.46626 2.07266L7.10067 3.25478C6.81754 3.34833 6.5437 3.46221 6.28088 3.59466L5.18613 3.0171C4.87091 2.85079 4.48411 2.90924 4.2321 3.16125L3.4093 3.9841L3.16127 4.23213C2.90925 4.48414 2.85081 4.87093 3.01711 5.18615L3.59466 6.28083C3.46219 6.54366 3.34831 6.81752 3.25475 7.10067L2.07267 7.46623C1.73218 7.57153 1.5 7.88635 1.5 8.24275L1.50003 9.4064V9.75723C1.50003 10.1136 1.73221 10.4284 2.0727 10.5337L3.25474 10.8993C3.3483 11.1825 3.46219 11.4563 3.59466 11.7192L3.0171 12.8139C2.8508 13.1291 2.90924 13.5159 3.16126 13.7679L3.41058 14.0173L4.23212 14.8388C4.48414 15.0908 4.87093 15.1492 5.18615 14.9829L6.28093 14.4054C6.54374 14.5378 6.81758 14.6517 7.10069 14.7452L7.46627 15.9273C7.57157 16.2678 7.8864 16.5 8.24281 16.5L9.75727 16.5C10.1137 16.5 10.4285 16.2678 10.5338 15.9273L10.8994 14.7452C11.1826 14.6517 11.4564 14.5378 11.7193 14.4053L12.814 14.9829C13.1292 15.1492 13.516 15.0907 13.7681 14.8387L14.5909 14.0159L14.8389 13.7678C15.0909 13.5158 15.1494 13.129 14.9831 12.8138L14.4055 11.7191C14.538 11.4563 14.6518 11.1824 14.7454 10.8993L15.9273 10.5337C16.2678 10.4284 16.5 10.1136 16.5 9.75722L16.5 9.4064V8.24275C16.5 7.88636 16.2678 7.57153 15.9273 7.46623L14.7454 7.10071C14.6518 6.8176 14.538 6.54378 14.4055 6.28098L14.9831 5.18623C15.1494 4.87101 15.091 4.48422 14.839 4.23221L14.5936 3.98681L13.7681 3.16132C13.5161 2.90931 13.1293 2.85087 12.8141 3.01717L11.7194 3.59472C11.4565 3.46223 11.1826 3.34833 10.8994 3.25475L10.5338 2.07266C10.4285 1.73218 10.1137 1.5 9.75726 1.5H8.24279ZM3.73602 4.80687L4.5588 3.9841L4.80685 3.73599L6.28493 4.51579L6.47686 4.41003C6.81044 4.22624 7.16611 4.07782 7.53884 3.96975L7.74922 3.90876L8.24279 2.31281L9.75726 2.31281L10.2508 3.90874L10.4612 3.96973C10.834 4.07782 11.1897 4.22627 11.5234 4.4101L11.7153 4.51586L13.1934 3.73606L13.4388 3.98151L14.2642 4.80695L13.4844 6.28502L13.5901 6.47695C13.7739 6.81051 13.9223 7.16616 14.0304 7.53887L14.0914 7.74925L15.6872 8.24275L15.6872 8.59359V9.75722L14.0914 10.2507L14.0304 10.4611C13.9223 10.8338 13.7739 11.1895 13.5901 11.5231L13.4844 11.715L14.2642 13.1931L13.4414 14.0159L13.1933 14.264L11.7152 13.4842L11.5233 13.5899C11.1897 13.7737 10.834 13.9222 10.4612 14.0303L10.2508 14.0913L9.75727 15.6872L8.24281 15.6872L7.74924 14.0912L7.53886 14.0302C7.16614 13.9222 6.81049 13.7738 6.47692 13.59L6.28498 13.4842L4.80687 14.2641L4.55752 14.0147L3.73601 13.1932L4.5158 11.7151L4.41005 11.5232C4.22624 11.1896 4.0778 10.8339 3.96973 10.4611L3.90873 10.2508L2.31285 9.75723L2.31282 8.59359L2.31282 8.24275L3.90874 7.74921L3.96973 7.53883C4.07781 7.16608 4.22624 6.8104 4.41004 6.47682L4.5158 6.28488L3.73602 4.80687ZM11.3629 9C11.3629 10.305 10.305 11.3629 9 11.3629C7.69501 11.3629 6.6371 10.305 6.6371 9C6.6371 7.69501 7.69501 6.6371 9 6.6371C10.305 6.6371 11.3629 7.69501 11.3629 9ZM12.2143 9C12.2143 10.7752 10.7752 12.2143 9 12.2143C7.2248 12.2143 5.78571 10.7752 5.78571 9C5.78571 7.2248 7.2248 5.78571 9 5.78571C10.7752 5.78571 12.2143 7.2248 12.2143 9Z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
