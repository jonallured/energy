import { Screen, Tabs } from "@artsy/palette-mobile"
import { HeaderProps } from "@artsy/palette-mobile/dist/elements/Screen/Header"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import {
  BottomSheetActions,
  BottomSheetActionsProps,
} from "components/BottomSheet/BottomSheetActions"
import { PortalProvider } from "components/Portal"
import { CollapsibleProps } from "react-native-collapsible-tab-view"
import { isTablet } from "react-native-device-info"

interface TabsViewProps {
  title: string
  bottomSheetActionsProps?: BottomSheetActionsProps
  headerProps?: HeaderProps
  showLargeHeaderText?: boolean
  children: CollapsibleProps["children"]
}

export const TabsView: React.FC<TabsViewProps> = ({
  children,
  bottomSheetActionsProps = {},
  headerProps: baseHeaderProps = {},
  showLargeHeaderText = true,
  title,
}) => {
  const navigation = useNavigation()

  const headerProps: HeaderProps = {
    onBack: navigation.goBack,
    titleProps: {
      alignItems: "flex-start",
      width: isTablet() ? "100%" : "80%",
    },
    ...baseHeaderProps,
  }

  return (
    <Screen.ScreenScrollContextProvider>
      <BottomSheetModalProvider>
        <PortalProvider>
          <Tabs.TabsWithHeader
            title={title}
            headerProps={headerProps}
            showLargeHeaderText={showLargeHeaderText}
          >
            {children}
          </Tabs.TabsWithHeader>
          <BottomSheetActions {...bottomSheetActionsProps} />
        </PortalProvider>
      </BottomSheetModalProvider>
    </Screen.ScreenScrollContextProvider>
  )
}