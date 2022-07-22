import { SpacerProps } from "../../atoms/Spacer"
import { Avatar } from "../Avatar"
import { Flex } from "../Flex"
import { Sans } from "../Text"
import { bullet } from "palette"

interface EntityHeaderProps extends SpacerProps {
  smallVariant?: boolean
  href?: string
  imageUrl?: string
  initials?: string
  meta?: string
  name: string
  FollowButton?: JSX.Element
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({
  smallVariant,
  href,
  imageUrl,
  initials,
  name,
  meta,
  FollowButton,
  ...remainderProps
}) => {
  const followButton = FollowButton && (
    <Flex
      ml={smallVariant ? 0.3 : 1}
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
    >
      {FollowButton}
    </Flex>
  )

  const headerName = (
    <Sans ellipsizeMode="tail" numberOfLines={1} size="3" style={{ flexShrink: 1 }}>
      {name}
    </Sans>
  )

  const headerMeta = !!meta && (
    <Sans ellipsizeMode="tail" numberOfLines={1} size="2" color="black60" style={{ flexShrink: 1 }}>
      {meta}
    </Sans>
  )

  return (
    <Flex flexDirection="row" flexWrap="nowrap" {...remainderProps}>
      {!!(imageUrl || initials) && (
        <Flex mr={1} justifyContent="center">
          <Avatar size="xs" src={imageUrl} initials={initials} />
        </Flex>
      )}

      {smallVariant ? (
        <Flex flexDirection="row" justifyContent="flex-start" flexGrow={1} alignItems="center">
          {headerName}

          <Sans size="3" ml={0.3}>
            {bullet}
          </Sans>

          {followButton}
        </Flex>
      ) : (
        <Flex justifyContent="space-between" width={0} flexGrow={1} flexDirection="row">
          <Flex alignSelf="center" flexShrink={1}>
            {headerName}
            {headerMeta}
          </Flex>
          {followButton}
        </Flex>
      )}
    </Flex>
  )
}

EntityHeader.displayName = "EntityHeader"
