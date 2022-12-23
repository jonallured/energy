declare module "react-native-animated-ellipsis" {
  import { Component } from "react"
  import { Animated, TextStyle } from "react-native"

  export interface AnimatedEllipsisProps {
    numberOfDots?: number
    animationDelay?: number
    minOpacity?: number
    style?: TextStyle
  }

  export default class AnimatedEllipsis extends Component<AnimatedEllipsisProps> {
    animatedValue: Animated.Value
    dots: string[]
    animation: Animated.CompositeAnimation
    constructor(props: AnimatedEllipsisProps)
    componentDidMount(): void
    componentWillUnmount(): void
    startAnimation(): void
    stopAnimation(): void
    render(): JSX.Element
  }
}
