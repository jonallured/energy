import { ScreenWrapper } from "./Screen"
import { AnimatedTitleHeader, PlaceholderAnimatedTitleHeader } from "./exposed/AnimatedTitleHeader"
import {
  AnimatedTitleTabsBody,
  PlaceholderAnimatedTitleTabsBody,
} from "./exposed/AnimatedTitleTabsBody"
import { Background } from "./exposed/Background"
import { Body } from "./exposed/Body"
import { BodyXPadding } from "./exposed/BodyXPadding"
import { BottomView, SafeBottomPadding } from "./exposed/BottomView"
import { FloatingHeader } from "./exposed/FloatingHeader"
import { FloatingHeaderBackButton } from "./exposed/FloatingHeaderBackButton"
import { FullWidthItem } from "./exposed/FullWidthItem"
import { Header } from "./exposed/Header"
import { LargeTitle } from "./exposed/LargeTitle"
import { RawHeader } from "./exposed/RawHeader"
import { TabsBody, PlaceholderTabsBody } from "./exposed/TabsBody"

export const Screen = Object.assign(ScreenWrapper, {
  Body,
  TabsBody,
  Header,
  FloatingHeader,
  FloatingHeaderBackButton,
  RawHeader,
  AnimatedTitleHeader,
  AnimatedTitleTabsBody,
  Background,
  BottomView,
  BodyXPadding,
  SafeBottomPadding,
  LargeTitle,
  FullWidthItem,

  PlaceholderTabsBody,
  PlaceholderAnimatedTitleHeader,
  PlaceholderAnimatedTitleTabsBody,
})
