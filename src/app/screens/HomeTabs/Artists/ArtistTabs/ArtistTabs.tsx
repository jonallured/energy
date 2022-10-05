import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useRef } from "react"
import { Tabs } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header } from "app/sharedUI"
import {
  BottomSheetModalRow,
  BottomSheetModalView,
  BottomSheetRef,
} from "app/sharedUI/molecules/BottomSheetModalView"
import { GlobalStore } from "app/store/GlobalStore"
import { SuspenseWrapper, TabsContainer } from "app/wrappers"
import { BriefcaseIcon, Button, EnvelopeIcon, Flex, Text } from "palette"
import { ArtistArtworks } from "./ArtistArtworks/ArtistArtworks"
import { ArtistDocuments } from "./ArtistDocuments/ArtistDocuments"
import { ArtistShows } from "./ArtistShows/ArtistShows"

type ArtistTabsRoute = RouteProp<HomeTabsScreens, "ArtistTabs">
type ArtistTabsProps = {
  slug: string
  name: string
}

export const ArtistTabs: React.FC<ArtistTabsProps> = () => {
  const { slug, name } = useRoute<ArtistTabsRoute>().params
  const safeAreaInsets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const selectedWorks = GlobalStore.useAppState((state) => state.selectMode.items.works)
  const selectedDocs = GlobalStore.useAppState((state) => state.selectMode.items.documents)

  const addToButtonHandler = () => {
    bottomSheetRef.current?.showBottomSheetModal()
  }

  return (
    <BottomSheetModalProvider>
      <TabsContainer
        header={(props) => (
          <Header
            label={name}
            onPress={() => GlobalStore.actions.selectMode.cancelSelectMode()}
            {...props}
          />
        )}
      >
        <Tabs.Tab name="ArtistArtworks" label="Works">
          <SuspenseWrapper withTabs>
            <ArtistArtworks slug={slug} />
          </SuspenseWrapper>
        </Tabs.Tab>
        <Tabs.Tab name="ArtistShows" label="Shows">
          <SuspenseWrapper withTabs>
            <ArtistShows slug={slug} />
          </SuspenseWrapper>
        </Tabs.Tab>
        <Tabs.Tab name="ArtistDocuments" label="Documents">
          <SuspenseWrapper withTabs>
            <ArtistDocuments slug={slug} />
          </SuspenseWrapper>
        </Tabs.Tab>
      </TabsContainer>
      {(selectedWorks.length > 0 || selectedDocs.length > 0) && (
        <Flex
          position="absolute"
          bottom={0}
          px={2}
          pt={1}
          backgroundColor="background"
          pb={safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 2}
          width="100%"
        >
          <Text variant="xs" color="primary" mb={1} textAlign="center">
            Selected items: {selectedWorks.length + selectedDocs.length}
          </Text>
          <Button block onPress={addToButtonHandler}>
            Add to ...
          </Button>
        </Flex>
      )}
      <BottomSheetModalView
        ref={bottomSheetRef}
        modalHeight={250}
        modalRows={
          <>
            <BottomSheetModalRow
              Icon={<BriefcaseIcon fill="onBackgroundHigh" />}
              label="Add to Album"
              navigateTo={() => console.log("Do nothing")}
            />
            <BottomSheetModalRow
              Icon={<EnvelopeIcon fill="onBackgroundHigh" />}
              label="Share by Email"
              navigateTo={() => console.log("Do nothing")}
            />
          </>
        }
      />
    </BottomSheetModalProvider>
  )
}
