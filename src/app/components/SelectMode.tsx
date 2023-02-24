import { Button, Flex } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"

interface SelectModeProps {
  allSelected: boolean
  selectAll: () => void
  unselectAll: () => void
}

export const SelectMode: React.FC<SelectModeProps> = ({ allSelected, selectAll, unselectAll }) => {
  const insets = useSafeAreaInsets()
  const isActive = GlobalStore.useAppState((state) => state.selectMode.sessionState.isActive)

  const handleSelectButtonPress = () => {
    GlobalStore.actions.selectMode.toggleSelectMode()
  }

  return (
    <Flex
      flexDirection="row"
      justifyContent={isActive ? "space-between" : "flex-end"}
      width="100%"
      px={SCREEN_HORIZONTAL_PADDING}
      mt="8px"
      top={insets.top}
      position="absolute"
      zIndex={1}
      pointerEvents="box-none"
    >
      {isActive && (
        <Button
          size="small"
          variant="fillGray"
          onPress={allSelected ? unselectAll : selectAll}
          longestText="Unselect All"
        >
          {allSelected ? "Unselect All" : "Select All"}
        </Button>
      )}

      <Button
        size="small"
        variant="fillGray"
        onPress={handleSelectButtonPress}
        longestText="Cancel"
      >
        {isActive ? "Cancel" : "Select"}
      </Button>
    </Flex>
  )
}
