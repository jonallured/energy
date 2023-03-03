import { BriefcaseIcon, Button, EnvelopeIcon, Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "app/Navigation"
import {
  BottomSheetModalRow,
  BottomSheetModalView,
  BottomSheetRef,
} from "app/components/BottomSheetModalView"
import { PortalProvider } from "app/components/Portal"
import { TabScreen } from "app/components/Tabs/TabScreen"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useMailComposer } from "app/screens/Artwork/useMailComposer"
import { useNavigationSave } from "app/system/hooks/useNavigationSave"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItemArtwork } from "app/system/store/Models/SelectModeModel"
import { useIsOnline } from "app/utils/hooks/useIsOnline"
import { Screen } from "palette"
import { useRef } from "react"
import { ActivityIndicator } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArtistArtworks } from "./ArtistArtworks/ArtistArtworks"
import { ArtistDocuments } from "./ArtistDocuments/ArtistDocuments"
import { ArtistShows } from "./ArtistShows/ArtistShows"

type ArtistTabsRoute = RouteProp<NavigationScreens, "ArtistTabs">

export const ArtistTabs = () => {
  const { slug, name } = useRoute<ArtistTabsRoute>().params
  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const saveNavBeforeAddingToAlbum = useNavigationSave("before-adding-to-album")
  const isOnline = useIsOnline()
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )
  const { sendMail } = useMailComposer()

  const shareByEmailHandler = async () => {
    await sendMail({ artworks: selectedItems as SelectedItemArtwork[] })
  }

  const addToButtonHandler = () => {
    bottomSheetRef.current?.showBottomSheetModal()
  }

  const closeBottomSheetModal = () => {
    bottomSheetRef.current?.closeBottomSheetModal()
  }

  return (
    <BottomSheetModalProvider>
      <PortalProvider>
        <Screen>
          <Screen.AnimatedTitleHeader title={name} hideRightElements={!isOnline} />
          <Screen.AnimatedTitleTabsBody>
            <Tabs.Tab name="ArtistArtworks" label="Works">
              <TabScreen>
                <ArtistArtworks slug={slug} />
              </TabScreen>
            </Tabs.Tab>
            <Tabs.Tab name="ArtistShows" label="Shows">
              <TabScreen>
                <ArtistShows slug={slug} />
              </TabScreen>
            </Tabs.Tab>
            <Tabs.Tab name="ArtistDocuments" label="Documents">
              <TabScreen>
                <ArtistDocuments slug={slug} />
              </TabScreen>
            </Tabs.Tab>
          </Screen.AnimatedTitleTabsBody>
        </Screen>
      </PortalProvider>

      {selectedItems.length > 0 && (
        <Flex
          position="absolute"
          bottom={0}
          px={2}
          pt={1}
          backgroundColor="background"
          pb={safeAreaInsets.bottom > 0 ? `${safeAreaInsets.bottom}px` : 2}
          width="100%"
        >
          <Text variant="xs" color="primary" mb={1} textAlign="center">
            Selected items: {selectedItems.length}
          </Text>
          <Button block onPress={addToButtonHandler}>
            Add to Album or Email
          </Button>
        </Flex>
      )}

      <BottomSheetModalView
        ref={bottomSheetRef}
        modalHeight={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom + 230 : 250}
        modalRows={
          <>
            <BottomSheetModalRow
              Icon={<BriefcaseIcon fill="onBackgroundHigh" />}
              label="Add to Album"
              onPress={() => {
                saveNavBeforeAddingToAlbum()
                navigation.navigate("AddItemsToAlbum", {
                  closeBottomSheetModal,
                  artworksToAdd: selectedItems,
                })
              }}
            />
            <BottomSheetModalRow
              Icon={<EnvelopeIcon fill="onBackgroundHigh" />}
              label="Share by Email"
              onPress={shareByEmailHandler}
              isLastRow
            />
          </>
        }
      />
    </BottomSheetModalProvider>
  )
}

export const SkeletonArtistTabs = () => {
  const isOnline = useIsOnline()

  return (
    <Screen>
      <Screen.AnimatedTitleHeader title="" hideRightElements={!isOnline} />
      <Screen.AnimatedTitleTabsBody>
        <Tabs.Tab name="ArtistArtworks" label="Works">
          <TabsScrollView>
            <Flex my={2}>
              <ActivityIndicator />
            </Flex>
          </TabsScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="ArtistShows" label="Shows">
          <></>
        </Tabs.Tab>
        <Tabs.Tab name="ArtistDocuments" label="Documents">
          <></>
        </Tabs.Tab>
      </Screen.AnimatedTitleTabsBody>
    </Screen>
  )
}
