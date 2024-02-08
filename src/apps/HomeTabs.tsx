import {
  MenuIcon,
  Touchable,
  MagnifyingGlassIcon,
  DEFAULT_HIT_SLOP,
  Tabs,
} from "@artsy/palette-mobile"
// import { ConversationsTab } from "apps/Conversations/ConversationsTab"
import { TabsView } from "components/TabsView"
import { useSetupRageShake } from "system/devTools/useSetupRageShake"
// import { useFeatureFlag } from "system/hooks/useFeatureFlag"
import { useRouter } from "system/hooks/useRouter"
import { TabScreen } from "system/wrappers/TabScreen"
import { useIsOnline } from "utils/hooks/useIsOnline"
import { AlbumsTab } from "./Albums/AlbumsTab"
import { ArtistsTab } from "./Artists/ArtistsTab"
import { ShowsTab } from "./Shows/ShowsTab"

export const HomeTabs = () => {
  const isOnline = useIsOnline()
  const { router } = useRouter()
  // const partnerConvosEnabled = useFeatureFlag("amber_folio-partner-convos")

  useSetupRageShake()

  return (
    <TabsView
      title="Folio"
      showLargeHeaderText={false}
      headerProps={{
        animated: false,
        leftElements: (
          <Touchable
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => router.navigate("Settings")}
          >
            <MenuIcon fill="onBackgroundHigh" top="1px" />
          </Touchable>
        ),
        rightElements: (
          <>
            {!!isOnline && (
              <Touchable
                onPress={() => router.navigate("Search")}
                hitSlop={DEFAULT_HIT_SLOP}
              >
                <MagnifyingGlassIcon fill="onBackgroundHigh" top="0px" />
              </Touchable>
            )}
          </>
        ),
      }}
    >
      <Tabs.Tab name="Artists" label="Artists">
        <TabScreen>
          <ArtistsTab />
        </TabScreen>
      </Tabs.Tab>
      <Tabs.Tab name="Shows" label="Shows">
        <TabScreen>
          <ShowsTab />
        </TabScreen>
      </Tabs.Tab>
      <Tabs.Tab name="Albums" label="Albums">
        <TabScreen>
          <AlbumsTab />
        </TabScreen>
      </Tabs.Tab>

      {/* {!!partnerConvosEnabled ? (
        <Tabs.Tab name="Conversations" label="Convos">
          <TabScreen>
            <ConversationsTab />
          </TabScreen>
        </Tabs.Tab>
      ) : null} */}
    </TabsView>
  )
}
