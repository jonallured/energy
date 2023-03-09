import { BriefcaseIcon, Button, EnvelopeIcon, Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"
import {
  BottomSheetRef,
  BottomSheetModalView,
  BottomSheetModalRow,
} from "components/BottomSheetModalView"
import { PortalProvider } from "components/Portal"
import { Screen } from "components/Screen"
import { TabScreen } from "components/Tabs/TabScreen"
import { useRef } from "react"
import { Tabs } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql } from "react-relay"
import { useMailComposer } from "screens/Artwork/useMailComposer"
import { useNavigationSave } from "system/hooks/useNavigationSave"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { ShowArtworks } from "./ShowArtworks"
import { ShowDocuments } from "./ShowDocuments"
import { ShowInstalls } from "./ShowInstalls"

type ShowTabsRoute = RouteProp<NavigationScreens, "ArtistTabs">

export const ShowTabs = () => {
  const { slug } = useRoute<ShowTabsRoute>().params
  const data = useSystemQueryLoader<ShowTabsQuery>(showTabsQuery, { slug })

  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const saveNavBeforeAddingToAlbum = useNavigationSave("before-adding-to-album")
  const safeAreaInsets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetRef>(null)

  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const { sendMail } = useMailComposer()

  const shareByEmailHandler = async () => {
    await sendMail({ artworks: selectedItems as SelectedItemArtwork[] })
  }

  return (
    <BottomSheetModalProvider>
      <PortalProvider>
        <Screen>
          <Screen.AnimatedTitleHeader title={data.show?.name!} />
          <Screen.AnimatedTitleTabsBody>
            <Tabs.Tab name="ShowArtworks" label="Works">
              <TabScreen>
                <ShowArtworks slug={slug} />
              </TabScreen>
            </Tabs.Tab>
            <Tabs.Tab name="ShowInstalls" label="Installs">
              <TabScreen>
                <ShowInstalls slug={slug} />
              </TabScreen>
            </Tabs.Tab>
            <Tabs.Tab name="ShowDocuments" label="Documents">
              <TabScreen>
                <ShowDocuments slug={slug} />
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
          <Button block onPress={bottomSheetRef.current?.showBottomSheetModal}>
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
                  closeBottomSheetModal: bottomSheetRef.current?.closeBottomSheetModal,
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

export const showTabsQuery = graphql`
  query ShowTabsQuery($slug: String!) {
    show(id: $slug) {
      name

      artworksConnection(first: 99) {
        edges {
          node {
            ...Artwork_artworkProps @relay(mask: false)
          }
        }
      }
    }
  }
`

export const SkeletonShowTabs = () => {
  const safeAreaInsets = useSafeAreaInsets()

  return (
    <BottomSheetModalProvider>
      <Screen>
        <Screen.AnimatedTitleHeader title="" />
        <Screen.AnimatedTitleTabsBody>
          <Tabs.Tab name="ShowArtworks" label="Works">
            <></>
          </Tabs.Tab>
          <Tabs.Tab name="ShowInstalls" label="Installs">
            <></>
          </Tabs.Tab>
          <Tabs.Tab name="ShowDocuments" label="Documents">
            <></>
          </Tabs.Tab>
        </Screen.AnimatedTitleTabsBody>
      </Screen>

      <BottomSheetModalView
        modalHeight={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom + 230 : 250}
        modalRows={
          <>
            <BottomSheetModalRow
              Icon={<BriefcaseIcon fill="onBackgroundHigh" />}
              label="Add to Album"
              onPress={() => {}}
            />
            <BottomSheetModalRow
              Icon={<EnvelopeIcon fill="onBackgroundHigh" />}
              label="Share by Email"
              onPress={() => console.log("Do nothing")}
              isLastRow
            />
          </>
        }
      />
    </BottomSheetModalProvider>
  )
}
