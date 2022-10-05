import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { forwardRef, ReactElement, useCallback, useImperativeHandle, useMemo, useRef } from "react"
import {
  ArrowRightIcon,
  CloseIcon,
  Flex,
  Separator,
  Spacer,
  Text,
  Touchable,
  useTheme,
} from "palette"

interface BottomSheetModalViewProps {
  modalHeight: string | number
  modalRows: ReactElement
  extraButtons?: ReactElement | false
}

export interface BottomSheetRef {
  showBottomSheetModal(): void
}

export const BottomSheetModalView = forwardRef<BottomSheetRef, BottomSheetModalViewProps>(
  (props, ref) => {
    const { color } = useTheme()

    const bottomSheetModalRef = useRef<BottomSheetModal>(null)

    const snapPoints = useMemo(() => [props.modalHeight], [])

    useImperativeHandle(ref, () => ({
      showBottomSheetModal() {
        handlePresentModalPress()
      },
    }))

    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present()
    }, [])

    return (
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
            {props.modalRows}
            <Spacer y={4} />
            {props.extraButtons}
          </Flex>
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  }
)

interface BottomSheetModalRowProps {
  Icon: ReactElement
  label: string
  navigateTo: () => void
}

export const BottomSheetModalRow = ({ Icon, label, navigateTo }: BottomSheetModalRowProps) => {
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
