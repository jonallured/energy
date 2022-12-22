import { BriefcaseIcon, Button, EnvelopeIcon, Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useRef } from "react"
import { Tabs } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql } from "react-relay"
import { ShowTabsQuery } from "__generated__/ShowTabsQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import {
  BottomSheetRef,
  BottomSheetModalView,
  BottomSheetModalRow,
} from "app/components/BottomSheetModalView"
import { useNavigationSave } from "app/system/hooks/useNavigationSave"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { useHeaderSelectModeConfig } from "app/system/store/selectModeAtoms"
import { ErrorBoundary } from "app/system/wrappers/ErrorBoundary"
import { SuspenseWrapper } from "app/system/wrappers/SuspenseWrapper"
import { Screen } from "palette"
import { ShowArtworks } from "./ShowArtworks/ShowArtworks"
import { ShowDocuments } from "./ShowDocuments/ShowDocuments"
import { ShowInstalls } from "./ShowInstalls/ShowInstalls"

type ShowTabsRoute = RouteProp<NavigationScreens, "ArtistTabs">

export const ShowTabs = () => {
  const { slug } = useRoute<ShowTabsRoute>().params

  const data = useSystemQueryLoader<ShowTabsQuery>(showTabsQuery, { slug })

  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const saveNavBeforeAddingToAlbum = useNavigationSave("before-adding-to-album")
  const safeAreaInsets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetRef>(null)

  const selectModeConfig = useHeaderSelectModeConfig()
  const selectedItems = GlobalStore.useAppState((state) => state.selectMode.items)

  return (
    <BottomSheetModalProvider>
      <Screen>
        <Screen.AnimatedTitleHeader title={data.show?.name!} selectModeConfig={selectModeConfig} />
        <Screen.AnimatedTitleTabsBody>
          <Tabs.Tab name="ShowArtworks" label="Works">
            <ErrorBoundary withoutBackButton>
              <SuspenseWrapper withTabs>
                <ShowArtworks slug={slug} />
              </SuspenseWrapper>
            </ErrorBoundary>
          </Tabs.Tab>
          <Tabs.Tab name="ShowInstalls" label="Installs">
            <ErrorBoundary withoutBackButton>
              <SuspenseWrapper withTabs>
                <ShowInstalls slug={slug} />
              </SuspenseWrapper>
            </ErrorBoundary>
          </Tabs.Tab>
          <Tabs.Tab name="ShowDocuments" label="Documents">
            <ErrorBoundary withoutBackButton>
              <SuspenseWrapper withTabs>
                <ShowDocuments slug={slug} />
              </SuspenseWrapper>
            </ErrorBoundary>
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
              onPress={() => console.log("Do nothing")}
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
    }
  }
`
