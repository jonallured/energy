import { Background } from "components/Screen/Background"
import { Body } from "components/Screen/Body"
import { BottomView } from "components/Screen/BottomView"
import { FloatingHeader } from "components/Screen/FloatingHeader"
import { FullWidthDivider } from "components/Screen/FullWidthDivider"
import { FullWidthItem } from "components/Screen/FullWidthItem"
import { AnimatedHeader, Header } from "components/Screen/Header"
import { ScreenBase } from "components/Screen/ScreenBase"

export const Screen = Object.assign(ScreenBase, {
  AnimatedHeader,
  Background,
  Body,
  BottomView,
  FloatingHeader,
  FullWidthDivider,
  FullWidthItem,
  Header,
})
