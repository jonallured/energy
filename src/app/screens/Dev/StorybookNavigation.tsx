import { createStackNavigator } from "@react-navigation/stack"
import { FolioDesignLanguage } from "app/screens/Dev/FolioDesignLanguage"
import { InsteadOfStorybook } from "app/screens/Dev/InsteadOfStorybook"
import { StorybookScreenAnimatedTitleHeader } from "app/screens/Dev/StorybookScreenAnimatedTitleHeader"
import { StorybookScreenAnimatedTitleHeaderTabs } from "app/screens/Dev/StorybookScreenAnimatedTitleHeaderTabs"
import { StorybookScreenBottomView } from "app/screens/Dev/StorybookScreenBottomView"
import { StorybookScreenFullWidthItem } from "app/screens/Dev/StorybookScreenFullWidthItem"
import { StorybookScreenHeader } from "app/screens/Dev/StorybookScreenHeader"
import { StorybookScreenHeaderElements } from "app/screens/Dev/StorybookScreenHeaderElements"
import { StorybookScreenRawHeader } from "app/screens/Dev/StorybookScreenRawHeader"

export type StorybookScreens = {
  FolioDesignLanguage: undefined
  InsteadOfStorybook: undefined
  StorybookScreenAnimatedTitleHeader: undefined
  StorybookScreenAnimatedTitleHeaderTabs: undefined
  StorybookScreenBottomView: undefined
  StorybookScreenFullWidthItem: undefined
  StorybookScreenHeader: undefined
  StorybookScreenHeaderElements: undefined
  StorybookScreenRawHeader: undefined
}

const { Screen } = createStackNavigator<StorybookScreens>()

export const StorybookNavigation = () => {
  return (
    <>
      <Screen name="FolioDesignLanguage" component={FolioDesignLanguage} />
      <Screen name="InsteadOfStorybook" component={InsteadOfStorybook} />
      <Screen
        name="StorybookScreenAnimatedTitleHeader"
        component={StorybookScreenAnimatedTitleHeader}
      />
      <Screen
        name="StorybookScreenAnimatedTitleHeaderTabs"
        component={StorybookScreenAnimatedTitleHeaderTabs}
      />
      <Screen name="StorybookScreenBottomView" component={StorybookScreenBottomView} />
      <Screen name="StorybookScreenFullWidthItem" component={StorybookScreenFullWidthItem} />
      <Screen name="StorybookScreenHeader" component={StorybookScreenHeader} />
      <Screen name="StorybookScreenHeaderElements" component={StorybookScreenHeaderElements} />
      <Screen name="StorybookScreenRawHeader" component={StorybookScreenRawHeader} />
    </>
  )
}
