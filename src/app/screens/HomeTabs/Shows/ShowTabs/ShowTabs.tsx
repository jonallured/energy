import { BriefcaseIcon, Button, EnvelopeIcon, Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useRef } from "react"
import { Tabs } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import {
  BottomSheetModalRow,
  BottomSheetModalView,
  BottomSheetRef,
} from "app/sharedUI/molecules/BottomSheetModalView"
import { GlobalStore } from "app/store/GlobalStore"
import { useHeaderSelectModeConfig } from "app/store/selectModeAtoms"
import { SuspenseWrapper } from "app/wrappers"
import { Screen } from "palette"
import { ShowArtworks } from "./ShowArtworks/ShowArtworks"
import { ShowDocuments } from "./ShowDocuments/ShowDocuments"
import { ShowInstalls } from "./ShowInstalls/ShowInstalls"

type ShowTabsRoute = RouteProp<NavigationScreens, "ArtistTabs">

export const ShowTabs = () => {
  const { slug } = useRoute<ShowTabsRoute>().params

  const data = useLazyLoadQuery<ShowTabsQuery>(
    graphql`
      query ShowTabsQuery($slug: String!) {
        show(id: $slug) {
          name
        }
      }
    `,
    { slug }
  )

  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const safeAreaInsets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetRef>(null)

  const selectModeConfig = useHeaderSelectModeConfig()
  const selectedWorks = GlobalStore.useAppState((state) => state.selectMode.items.works)
  const selectedDocs = GlobalStore.useAppState((state) => state.selectMode.items.documents)

  return (
    <BottomSheetModalProvider>
      <Screen>
        <Screen.AnimatedTitleHeader title={data.show?.name!} selectModeConfig={selectModeConfig} />
        <Screen.AnimatedTitleTabsBody>
          <Tabs.Tab name="ShowArtworks" label="Works">
            <SuspenseWrapper withTabs>
              <ShowArtworks slug={slug} />
            </SuspenseWrapper>
          </Tabs.Tab>
          <Tabs.Tab name="ShowInstalls" label="Installs">
            <SuspenseWrapper withTabs>
              <ShowInstalls slug={slug} />
            </SuspenseWrapper>
          </Tabs.Tab>
          <Tabs.Tab name="ShowDocuments" label="Documents">
            <SuspenseWrapper withTabs>
              <ShowDocuments slug={slug} />
            </SuspenseWrapper>
          </Tabs.Tab>
        </Screen.AnimatedTitleTabsBody>
      </Screen>

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
          <Button block onPress={bottomSheetRef.current?.showBottomSheetModal}>
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
              onPress={() =>
                navigation.navigate("AddItemsToAlbum", {
                  areMultipleArtworks: true,
                  slug,
                  closeBottomSheetModal: bottomSheetRef.current?.closeBottomSheetModal,
                })
              }
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
