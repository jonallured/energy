import { useSetHandledTopSafeArea, useSetScreenTitleIsAnimated } from "components/Screen/atoms"
import { ActualHeader, ActualHeaderProps } from "components/Screen/notExposed/ActualHeader"
import { RawHeader } from "./RawHeader"

type HeaderProps = Omit<ActualHeaderProps, "animatedTitle" | "titleShown">

export const Header = (props: HeaderProps) => {
  useSetHandledTopSafeArea(true)
  useSetScreenTitleIsAnimated(false)

  return (
    <RawHeader>
      <ActualHeader {...props} animatedTitle={false} />
    </RawHeader>
  )
}
Header.defaultProps = { __TYPE: "screen:header" }
