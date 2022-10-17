import { getChildrenByType, removeChildrenByType } from "react-nanny"
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Flex, FlexProps, SpacingUnit } from "palette"
import { Wrap, ArtsyKeyboardAvoidingView } from "shared/utils"
import { BottomView } from "./BottomView"
import {
  useHandledTopSafeArea,
  useScreenBottomViewHeight,
  useScreenTitleIsAnimated,
  useSetScreenIsFullWidthBody,
} from "../atoms"
import { useAnimatedHeaderScrolling } from "../hooks"
import { useSharedValue } from "react-native-reanimated"
import { LargeTitle } from "./LargeTitle"

export const SCREEN_HORIZONTAL_PADDING: SpacingUnit = 2

interface BodyProps extends Pick<FlexProps, "backgroundColor"> {
  children?: React.ReactNode
  scroll?: boolean
  nosafe?: boolean
  fullwidth?: boolean
}

export const Body = ({
  scroll = false,
  nosafe = false,
  fullwidth = false,
  children,
  ...restFlexProps
}: BodyProps) => {
  const childrenExceptBottomView = removeChildrenByType(children, BottomView)
  const bottomView = getChildrenByType(children, BottomView)
  const handledTopSafeArea = useHandledTopSafeArea()
  const bottomViewHeight = useScreenBottomViewHeight()
  const insets = useSafeAreaInsets()
  const withTopSafeArea = handledTopSafeArea
  const withBottomSafeArea = !nosafe

  useSetScreenIsFullWidthBody(fullwidth)

  const scrollOffsetY = useSharedValue(0)
  useAnimatedHeaderScrolling(scrollOffsetY)
  const usingAnimatedTitle = useScreenTitleIsAnimated()

  return (
    <>
      <Flex
        flex={1}
        mt={withTopSafeArea ? `${insets.top}px` : undefined}
        mb={withBottomSafeArea ? `${insets.bottom}px` : undefined}
        {...restFlexProps}
      >
        <Wrap if={scroll}>
          <ArtsyKeyboardAvoidingView>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentInset={{ bottom: bottomViewHeight - insets.bottom }}
              scrollEventThrottle={0.0000000001}
              onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                scrollOffsetY.value = event.nativeEvent.contentOffset.y
              }}
            >
              {usingAnimatedTitle && <LargeTitle />}
              <Wrap.Content>
                <Flex flex={1} px={fullwidth ? undefined : SCREEN_HORIZONTAL_PADDING}>
                  {childrenExceptBottomView}
                </Flex>
              </Wrap.Content>
            </ScrollView>
            {bottomView}
          </ArtsyKeyboardAvoidingView>
        </Wrap>
      </Flex>
    </>
  )
}
Body.defaultProps = { __TYPE: "screen:body" }
