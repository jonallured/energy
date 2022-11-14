import { BriefcaseIcon, Button, EnvelopeIcon, Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useRef } from "react"
import { Tabs } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistTabsQuery } from "__generated__/ArtistTabsQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { useNavigationSave } from "app/navigation/navAtoms"
import {
  BottomSheetModalRow,
  BottomSheetModalView,
  BottomSheetRef,
} from "app/sharedUI/molecules/BottomSheetModalView"
import { GlobalStore } from "app/store/GlobalStore"
import { useHeaderSelectModeConfig } from "app/store/selectModeAtoms"
import { SuspenseWrapper } from "app/wrappers"
import { Screen } from "palette"
import { ArtistArtworks } from "./ArtistArtworks/ArtistArtworks"
import { ArtistDocuments } from "./ArtistDocuments/ArtistDocuments"
import { ArtistShows } from "./ArtistShows/ArtistShows"

type ArtistTabsRoute = RouteProp<NavigationScreens, "ArtistTabs">

export const ArtistTabs = () => {
  const { slug } = useRoute<ArtistTabsRoute>().params
  const data = useLazyLoadQuery<ArtistTabsQuery>(artistQuery, { slug })
  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const selectedItems = GlobalStore.useAppState((state) => state.selectMode.items)

  const saveNavBeforeAddingToAlbum = useNavigationSave("before-adding-to-album")

  const addToButtonHandler = () => {
    bottomSheetRef.current?.showBottomSheetModal()
  }

  const closeBottomSheetModal = () => {
    bottomSheetRef.current?.closeBottomSheetModal()
  }

  const selectModeConfig = useHeaderSelectModeConfig()

  return (
    <BottomSheetModalProvider>
      <Screen>
        <Screen.AnimatedTitleHeader
          title={data.artist?.name ?? ""}
          selectModeConfig={selectModeConfig}
        />
        <Screen.AnimatedTitleTabsBody>
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
        </Screen.AnimatedTitleTabsBody>
      </Screen>

      {selectedItems.length > 0 && (
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
            Selected items: {selectedItems.length}
          </Text>
          <Button block onPress={addToButtonHandler}>
            Add to ...
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
                navigation.navigate("AddItemsToAlbum", { closeBottomSheetModal })
              }}
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

const artistQuery = graphql`
  query ArtistTabsQuery($slug: String!) {
    artist(id: $slug) {
      name
    }
  }
`
