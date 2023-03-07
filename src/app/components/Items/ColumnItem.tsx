import { Flex } from "@artsy/palette-mobile"

interface ColumnItemProps {
  index: number
  numColumns: number
  children: React.ReactNode
}

export const ColumnItem: React.FC<ColumnItemProps> = ({ index, numColumns, children }) => {
  const pl = index % numColumns === 0 ? undefined : 1
  const pr = index % numColumns === numColumns - 1 ? undefined : 1

  return (
    <Flex pl={pl} pr={pr}>
      {children}
    </Flex>
  )
}
