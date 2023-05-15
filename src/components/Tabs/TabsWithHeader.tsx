import { Flex, Text, Screen, NAVBAR_HEIGHT } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import {
  BottomSheetActions,
  BottomSheetActionsProps,
} from "components/BottomSheet/BottomSheetActions"
import { AnimatedTabsHeader, HeaderProps } from "components/Header"
import { PortalProvider } from "components/Portal"
import { TabsContainer } from "components/Tabs/TabsContainer"
import { TabsContext } from "components/Tabs/TabsContext"
import { CollapsibleProps } from "react-native-collapsible-tab-view"

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
  return (
    <TabsContext.Provider>
      <BottomSheetModalProvider>
        <PortalProvider>
          <Screen>
            <AnimatedTabsHeader title={title} {...headerProps} />

            <Screen.Body fullwidth>
              <TabsContainer
                renderHeader={() => {
                  if (!showHeader || !title) {
                    return null
                  }

                  return (
                    <Flex
                      height={NAVBAR_HEIGHT}
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
            </Screen.Body>
          </Screen>

          <BottomSheetActions {...bottomSheetActionsProps} />
        </PortalProvider>
      </BottomSheetModalProvider>
    </TabsContext.Provider>
  )
}
