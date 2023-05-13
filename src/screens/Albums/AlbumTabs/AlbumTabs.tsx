import {
  DEFAULT_HIT_SLOP,
  MoreIcon,
  SCREEN_HORIZONTAL_PADDING,
  Touchable,
} from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { BottomSheetRef } from "components/BottomSheet/BottomSheetModalView"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { TabScreen } from "components/Tabs/TabScreen"
import { TabsWithHeader } from "components/Tabs/TabsWithHeader"
import { useState } from "react"
import { Tabs } from "react-native-collapsible-tab-view"
import { useAlbum } from "screens/Albums/useAlbum"
import { AlbumArtworks } from "./AlbumArtworks"
import { AlbumDocuments } from "./AlbumDocuments"
import { AlbumInstalls } from "./AlbumInstalls"

type AlbumTabsRoute = RouteProp<NavigationScreens, "AlbumTabs">

export const AlbumTabs = () => {
  const [bottomSheetRef, setBottomSheetRef] = useState<BottomSheetRef | null>(null)
  const { albumId } = useRoute<AlbumTabsRoute>().params
  const { album } = useAlbum({ albumId })

  if (!album) {
    return <ListEmptyComponent />
  }

  const handleSetRef = (ref: BottomSheetRef) => {
    setBottomSheetRef(ref)
  }

  const addToButtonHandler = () => {
    bottomSheetRef?.showBottomSheetModal()
  }

  return (
    <TabsWithHeader
      title={album.name}
      bottomSheetActionsProps={{
        albumId,
        onSetRef: handleSetRef,
      }}
      headerProps={{
        rightElements: (
          <Touchable
            onPress={addToButtonHandler}
            hitSlop={DEFAULT_HIT_SLOP}
            style={{ paddingRight: `${SCREEN_HORIZONTAL_PADDING}%` }}
          >
            <MoreIcon />
          </Touchable>
        ),
      }}
    >
      <Tabs.Tab name="AlbumArtworks" label="Works">
        <TabScreen>
          <AlbumArtworks albumId={albumId} />
        </TabScreen>
      </Tabs.Tab>
      <Tabs.Tab name="AlbumInstalls" label="Installs">
        <AlbumInstalls albumId={albumId} />
      </Tabs.Tab>
      <Tabs.Tab name="AlbumDocuments" label="Documents">
        <TabScreen>
          <AlbumDocuments albumId={albumId} />
        </TabScreen>
      </Tabs.Tab>
    </TabsWithHeader>
  )
}
