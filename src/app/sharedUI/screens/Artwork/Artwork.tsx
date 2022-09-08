import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ReactElement, useCallback, useMemo, useRef } from "react"
import { Dimensions } from "react-native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header, ScrollableScreenEntity, ScrollableScreensView } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { SuspenseWrapper } from "app/wrappers"
import {
  CloseIcon,
  Text,
  Flex,
  MoreIcon,
  Separator,
  Touchable,
  ArtworkIcon,
  ArrowRightIcon,
  EditIcon,
  BriefcaseIcon,
  Spacer,
  useTheme,
} from "palette"
import { ArtworkContent } from "./ArtworkContent/ArtworkContent"
import { EditArtworkInCms } from "./EditArtworkInCms"

type ArtworkRoute = RouteProp<HomeTabsScreens, "Artwork">

export const Artwork = () => {
  const { color } = useTheme()
  const { params } = useRoute<ArtworkRoute>()
  const artworkSlugs = params.contextArtworkSlugs ?? [params.slug]
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()

  const screens: ScrollableScreenEntity[] = artworkSlugs.map((slug) => ({
    name: slug,
    content: (
      <SuspenseWrapper key={slug}>
        <ArtworkContent slug={slug} />
      </SuspenseWrapper>
    ),
  }))

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const height = Dimensions.get("window").height

  const snapPoints = useMemo(() => [height > 800 ? "65%" : "75%"], [])

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const handleSheetChanges = useCallback((index: number) => {}, [])

  const isEditArtworkHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.editArtwork
  )

  return (
    <BottomSheetModalProvider>
      <Header
        safeAreaInsets
        rightElements={
          <Touchable onPress={handlePresentModalPress}>
            <MoreIcon />
          </Touchable>
        }
      />
      <Flex flex={1}>
        <ScrollableScreensView screens={screens} initialScreenName={params.slug} />
      </Flex>
      <BottomSheetModal
        backdropComponent={() => (
          <Touchable
            style={{
              opacity: 0.4,
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            underlayColor="transparent"
            onPress={() => bottomSheetModalRef.current?.close()}
          >
            <Flex background="black" height="100%" />
          </Touchable>
        )}
        enablePanDownToClose
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        onChange={handleSheetChanges}
        handleComponent={() => (
          <Flex
            alignItems="center"
            justifyContent="center"
            height="50"
            backgroundColor="background"
            borderRadius={10}
          >
            <Flex m={2} position="absolute" left="0">
              <Touchable
                onPress={() => bottomSheetModalRef.current?.close()}
                underlayColor="transparent"
              >
                <CloseIcon fill="onBackgroundHigh" />
              </Touchable>
            </Flex>
            <Text weight="medium">More</Text>
          </Flex>
        )}
      >
        <BottomSheetScrollView style={{ backgroundColor: color("background") }}>
          <Separator />
          <Flex alignItems="center" mx="2">
            <ModalRow
              Icon={<ArtworkIcon fill="onBackgroundHigh" />}
              label="View in Room"
              navigateTo={() => {}}
            />
            <ModalRow
              Icon={<EditIcon fill="onBackgroundHigh" />}
              label="Send by Email"
              navigateTo={() => {}}
            />
            <ModalRow
              Icon={<BriefcaseIcon fill="onBackgroundHigh" />}
              label="Add to Album"
              navigateTo={() => navigation.navigate("AddArtworkToAlbum", { slug: params.slug })}
            />
            <Spacer y={4} />
            {!isEditArtworkHidden && <EditArtworkInCms slug={params.slug} />}
          </Flex>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}

interface ModalRowProps {
  Icon: ReactElement
  label: string
  navigateTo: () => void
}

const ModalRow = ({ Icon, label, navigateTo }: ModalRowProps) => {
  return (
    <Touchable
      onPress={navigateTo}
      underlayColor="transparent"
      style={{ width: "100%", height: 100 }}
    >
      <Flex flex={1}>
        <Flex flexDirection="row" flex={1}>
          <Flex width={25} alignItems="center" justifyContent="center">
            {Icon}
          </Flex>
          <Flex justifyContent="center" flex={1} ml="1">
            <Text>{label}</Text>
          </Flex>
          <Flex alignItems="center" justifyContent="center" width="25px">
            <ArrowRightIcon fill="onBackgroundHigh" />
          </Flex>
        </Flex>
        <Separator />
      </Flex>
    </Touchable>
  )
}
