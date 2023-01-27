import { StackCardStyleInterpolator } from "@react-navigation/stack"

export const slideFromLeft: { cardStyleInterpolator: StackCardStyleInterpolator } = {
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-layouts.screen.width, 0],
          }),
        },
      ],
    },
  }),
}
