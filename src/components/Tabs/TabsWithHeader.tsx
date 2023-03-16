import { Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import {
  BottomSheetActions,
  BottomSheetActionsProps,
} from "components/BottomSheet/BottomSheetActions"
import { PortalProvider } from "components/Portal"
import { Screen } from "components/Screen"
import { HeaderProps } from "components/Screen/Header"
import { LARGE_TITLE_HEIGHT } from "components/Screen/constants"
import { TabsContainer } from "components/Tabs/TabsContainer"
import { TabsContext } from "components/Tabs/TabsContext"
import { CollapsibleProps } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface TabsWithHeaderProps {
  title: string
  bottomSheetActionsProps?: BottomSheetActionsProps
  headerProps?: HeaderProps
  showHeader?: boolean
  children: CollapsibleProps["children"]
}

export const TabsWithHeader: React.FC<TabsWithHeaderProps> = ({
  children,
  bottomSheetActionsProps = {},
  headerProps = {},
  showHeader = true,
  title,
}) => {
  const insets = useSafeAreaInsets()

  return (
    <TabsContext.Provider>
      <BottomSheetModalProvider>
        <PortalProvider>
          <Screen>
            <Screen.AnimatedHeader title={title} {...headerProps} />

            <Flex mt={`${insets.top}px`} flex={1}>
              <TabsContainer
                renderHeader={() => {
                  if (!showHeader || !title) {
                    return null
                  }

                  return (
                    <Flex
                      height={LARGE_TITLE_HEIGHT}
                      pl={2}
                      justifyContent="center"
                      alignSelf="flex-start"
                    >
                      <Text variant="lg-display" numberOfLines={2}>
                        {title}
                      </Text>
                    </Flex>
                  )
                }}
              >
                {children}
              </TabsContainer>
            </Flex>
          </Screen>

          <BottomSheetActions {...bottomSheetActionsProps} />
        </PortalProvider>
      </BottomSheetModalProvider>
    </TabsContext.Provider>
  )
}
