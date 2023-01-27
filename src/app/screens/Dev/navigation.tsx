import { StackNav } from "app/Navigation"
import { BrowseOfflineCache } from "app/screens/Dev/BrowseOfflineCache"
import { DevMenu } from "app/screens/Dev/DevMenu"
import { FolioDesignLanguage } from "app/screens/Dev/FolioDesignLanguage"
import { InsteadOfStorybook } from "app/screens/Dev/InsteadOfStorybook"
import { StorybookScreenAnimatedTitleHeader } from "app/screens/Dev/StorybookScreenAnimatedTitleHeader"
import { StorybookScreenAnimatedTitleHeaderTabs } from "app/screens/Dev/StorybookScreenAnimatedTitleHeaderTabs"
import { StorybookScreenBottomView } from "app/screens/Dev/StorybookScreenBottomView"
import { StorybookScreenFullWidthItem } from "app/screens/Dev/StorybookScreenFullWidthItem"
import { StorybookScreenHeader } from "app/screens/Dev/StorybookScreenHeader"
import { StorybookScreenHeaderElements } from "app/screens/Dev/StorybookScreenHeaderElements"
import { StorybookScreenRawHeader } from "app/screens/Dev/StorybookScreenRawHeader"
import { StorybookSkeletons } from "app/screens/Dev/StorybookSkeletons"
import { slideFromLeft } from "app/utils/navigationAnimation"

export type DevNavigationScreens = {
  DevMenu: undefined
  BrowseOfflineCache: undefined
  FolioDesignLanguage: undefined
  InsteadOfStorybook: undefined
  StorybookScreenAnimatedTitleHeader: undefined
  StorybookScreenAnimatedTitleHeaderTabs: undefined
  StorybookScreenBottomView: undefined
  StorybookScreenFullWidthItem: undefined
  StorybookScreenHeader: undefined
  StorybookScreenHeaderElements: undefined
  StorybookScreenRawHeader: undefined
  StorybookSkeletons: undefined
}

export const DevNavigation = () => {
  return (
    <>
      <StackNav.Group>
        <StackNav.Screen name="FolioDesignLanguage" component={FolioDesignLanguage} />
        <StackNav.Screen name="InsteadOfStorybook" component={InsteadOfStorybook} />
        <StackNav.Screen
          name="StorybookScreenAnimatedTitleHeader"
          component={StorybookScreenAnimatedTitleHeader}
        />
        <StackNav.Screen
          name="StorybookScreenAnimatedTitleHeaderTabs"
          component={StorybookScreenAnimatedTitleHeaderTabs}
        />
        <StackNav.Screen name="StorybookScreenBottomView" component={StorybookScreenBottomView} />
        <StackNav.Screen
          name="StorybookScreenFullWidthItem"
          component={StorybookScreenFullWidthItem}
        />
        <StackNav.Screen name="StorybookScreenHeader" component={StorybookScreenHeader} />
        <StackNav.Screen
          name="StorybookScreenHeaderElements"
          component={StorybookScreenHeaderElements}
        />
        <StackNav.Screen name="StorybookScreenRawHeader" component={StorybookScreenRawHeader} />
        <StackNav.Screen
          name="BrowseOfflineCache"
          component={BrowseOfflineCache}
          options={{ ...slideFromLeft }}
        />
        <StackNav.Screen name="StorybookSkeletons" component={StorybookSkeletons} />
      </StackNav.Group>

      <StackNav.Group screenOptions={{ presentation: "modal", headerShown: false }}>
        <StackNav.Screen name="DevMenu" component={DevMenu} />
      </StackNav.Group>
    </>
  )
}
