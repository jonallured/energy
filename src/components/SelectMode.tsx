import { Button, Flex } from "@artsy/palette-mobile"
import { SCREEN_HORIZONTAL_PADDING, ZINDEX } from "components/Screen/constants"
import { isEqual } from "lodash"
import Animated from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItem } from "system/store/Models/SelectModeModel"
import { useFadeInAnimation } from "utils/hooks/animations/useFadeInAnimation"

interface SelectModeProps {
  allSelected: boolean
  selectAll: () => void
  unselectAll: () => void
}

export const SelectMode: React.FC<SelectModeProps> = ({ allSelected, selectAll, unselectAll }) => {
  const insets = useSafeAreaInsets()
  const isActive = GlobalStore.useAppState((state) => state.selectMode.sessionState.isActive)
  const { fadeInStyles } = useFadeInAnimation({ startAnimation: true })

  const handleSelectButtonPress = () => {
    GlobalStore.actions.selectMode.toggleSelectMode()
  }

  return (
    <Flex
      flexDirection="row"
      justifyContent={isActive ? "space-between" : "flex-end"}
      width="100%"
      px={SCREEN_HORIZONTAL_PADDING}
      mt={1}
      top={insets.top}
      position="absolute"
      zIndex={ZINDEX.selectMode}
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

      <Animated.View style={fadeInStyles}>
        <Button
          size="small"
          variant="fillGray"
          onPress={handleSelectButtonPress}
          longestText="Cancel"
        >
          {isActive ? "Cancel" : "Select"}
        </Button>
      </Animated.View>
    </Flex>
  )
}

export const isAllSelected = (selectedItems: SelectedItem[], items: SelectedItem[]) => {
  const allSelected = isEqual(
    new Set(selectedItems.map((item) => item?.internalID)),
    new Set(items.map((item) => item?.internalID))
  )
  return allSelected
}

export const isSelected = (selectedItems: SelectedItem[], item: SelectedItem) => {
  const isSelected = !!selectedItems.find(
    (selectedItem) => selectedItem?.internalID === item?.internalID
  )
  return isSelected
}
