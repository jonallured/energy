import {
  Spacer,
  ArrowRightIcon,
  CloseIcon,
  Flex,
  Separator,
  Text,
  Touchable,
  useColor,
  DEFAULT_HIT_SLOP,
} from "@artsy/palette-mobile"
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { forwardRef, ReactElement, useCallback, useImperativeHandle, useMemo, useRef } from "react"
import { GlobalStore } from "system/store/GlobalStore"

interface BottomSheetModalViewProps {
  modalHeight: string | number
  modalRows: ReactElement
  extraButtons?: ReactElement | false
}

export interface BottomSheetRef {
  showBottomSheetModal(): void
  closeBottomSheetModal(): void
}

export const BottomSheetModalView = forwardRef<BottomSheetRef, BottomSheetModalViewProps>(
  (props, ref) => {
    const isDarkMode = GlobalStore.useAppState((s) => s.devicePrefs.colorScheme === "dark")
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const color = useColor()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const snapPoints = useMemo(() => [props.modalHeight], [])

    useImperativeHandle(ref, () => ({
      showBottomSheetModal() {
        presentModal()
      },
      closeBottomSheetModal() {
        closeModal()
      },
    }))

    const presentModal = useCallback(() => {
      bottomSheetModalRef.current?.present()
    }, [])

    const closeModal = useCallback(() => {
      bottomSheetModalRef.current?.close()
    }, [])

    return (
      <BottomSheetModal
        style={{
          ...getBottomSheetShadowStyle(isDarkMode),
          zIndex: 1,
        }}
        backdropComponent={() => (
          <Touchable
            style={{
              opacity: 0.0,
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            underlayColor="transparent"
            onPress={() => bottomSheetModalRef.current?.close()}
          >
            <Flex backgroundColor="black" height="100%" />
          </Touchable>
        )}
        enablePanDownToClose
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        handleComponent={() => (
          <Flex
            alignItems="center"
            justifyContent="center"
            height="50px"
            backgroundColor="surface"
            borderTopLeftRadius={10}
            borderTopRightRadius={10}
          >
            <Flex m={2} position="absolute" left="0">
              <Touchable
                onPress={() => bottomSheetModalRef.current?.close()}
                underlayColor="transparent"
                hitSlop={DEFAULT_HIT_SLOP}
              >
                <CloseIcon fill="onSurfaceHigh" />
              </Touchable>
            </Flex>
            <Text weight="medium">More</Text>
          </Flex>
        )}
      >
        <BottomSheetScrollView
          style={{
            backgroundColor: color("surface"),
          }}
        >
          <Separator />
          <Flex alignItems="center">
            {props.modalRows}
            <Spacer y={4} />
            <Flex mx={2}>{props.extraButtons}</Flex>
          </Flex>
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  }
)

interface BottomSheetModalRowProps {
  Icon: ReactElement
  label: string
  subtitle?: string | null
  isLastRow?: boolean
  onPress: () => void
}

export const BottomSheetModalRow = ({
  Icon,
  label,
  subtitle,
  isLastRow,
  onPress,
}: BottomSheetModalRowProps) => (
  <Touchable
    onPress={onPress}
    underlayColor="transparent"
    activeOpacity={0.5}
    style={{ width: "100%", height: 100 }}
  >
    <Flex flex={1}>
      <Flex flexDirection="row" flex={1} mx={1}>
        <Flex width={25} alignItems="center" justifyContent="center">
          {Icon}
        </Flex>
        <Flex justifyContent="center" flex={1} ml={1}>
          <Text>{label}</Text>
          {subtitle && (
            <Flex flexDirection="row" alignItems="center">
              <Text variant="xs" color="onSurfaceMedium">
                {subtitle}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex alignItems="center" justifyContent="center" width="25px">
          <ArrowRightIcon fill="onSurfaceHigh" />
        </Flex>
      </Flex>
      {!isLastRow && <Separator />}
    </Flex>
  </Touchable>
)

export const getBottomSheetShadowStyle = (isDarkMode: boolean) => ({
  backgroundColor: isDarkMode ? "black" : "white",
  shadowColor: "black",
  zIndex: 1,
  shadowOpacity: 0.2,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 0 },
  elevation: 10,
})
