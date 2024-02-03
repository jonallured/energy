import {
  Button,
  Flex,
  SCREEN_HORIZONTAL_PADDING,
  ZINDEX,
} from "@artsy/palette-mobile"
import { isEqual } from "lodash"
import { MotiView } from "moti"
import { useEffect } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItem } from "system/store/Models/SelectModeModel"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

interface SelectModeProps {
  enabled: boolean
  activeTab: string
  allSelected: boolean
  selectAll: () => void
  unselectAll: () => void
}

export const SelectMode: React.FC<SelectModeProps> = ({
  enabled,
  activeTab,
  allSelected,
  selectAll,
  unselectAll,
}) => {
  const insets = useSafeAreaInsets()
  const isActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )
  const isDarkMode = useIsDarkMode()

  const handleSelectButtonPress = () => {
    GlobalStore.actions.selectMode.toggleSelectMode()
  }

  const backgroundColor = isDarkMode ? "black100" : "white100"

  useEffect(() => {
    GlobalStore.actions.selectMode.cancelSelectMode()
  }, [activeTab])

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      px={SCREEN_HORIZONTAL_PADDING}
      my="13px"
      top={insets.top}
      position="absolute"
      zIndex={ZINDEX.selectMode}
      pointerEvents="box-none"
      backgroundColor={isActive ? backgroundColor : "transparent"}
    >
      <MotiView
        from={{ opacity: isActive ? 1 : 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: isActive ? 200 : 100 }}
        pointerEvents={isActive ? "auto" : "none"}
      >
        <Button
          size="small"
          variant="fillGray"
          onPress={allSelected ? unselectAll : selectAll}
          longestText="Unselect All"
        >
          {allSelected ? "Unselect All" : "Select All"}
        </Button>
      </MotiView>

      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button
          size="small"
          variant="fillGray"
          onPress={handleSelectButtonPress}
          longestText="Cancel"
          disabled={!enabled}
        >
          {isActive ? "Cancel" : "Select"}
        </Button>
      </MotiView>
    </Flex>
  )
}

export const isAllSelected = (
  selectedItems: SelectedItem[],
  items: SelectedItem[]
) => {
  if (items.length === 0) {
    return false
  }
  const allSelected = isEqual(
    new Set(selectedItems.map((item) => item?.internalID)),
    new Set(items.map((item) => item?.internalID))
  )
  return allSelected
}

export const isSelected = (
  selectedItems: SelectedItem[],
  item: SelectedItem
) => {
  const isSelected = !!selectedItems.find(
    (selectedItem) => selectedItem?.internalID === item?.internalID
  )
  return isSelected
}
