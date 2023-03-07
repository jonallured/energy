import { Button, Flex } from "@artsy/palette-mobile"
import { useAtom } from "jotai"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"
import { disabledPillsAtom, selectedPillAtom } from "./searchAtoms"

export type PillType = "Artists" | "Shows" | "All"

const PILLS: PillType[] = ["Artists", "Shows"]

export const SearchPills = () => {
  const [selectedPill, setSelectedPill] = useAtom(selectedPillAtom)
  const [disabledPills] = useAtom(disabledPillsAtom)
  return (
    <Flex flexDirection="row" px={SCREEN_HORIZONTAL_PADDING}>
      {["All" as PillType].concat(PILLS).map((pill) => {
        return (
          <Button
            key={pill}
            size="small"
            variant={selectedPill === pill ? "fillSuccess" : "outlineGray"}
            onPress={() => setSelectedPill(pill)}
            disabled={disabledPills.includes(pill)}
            mr={1}
          >
            {pill}
          </Button>
        )
      })}
    </Flex>
  )
}
