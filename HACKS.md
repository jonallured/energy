<!-- Template

## Title

#### When can we remove this:

Tell us when we can remove this hack.

#### Explanation/Context:

Explain why the hack was added.

-->

👀 See comment on top of file for template.

## AnimatedTitleHeader useAnimatedReaction workaround

#### When can we remove this:

Honestly, not sure. We can try to remove it whenever and see if we don't get the weird behaviour.

#### Explanation/Context:

When navigating in a screen with an AnimatedTitleHeader and TabsBody, the small title would animate in an out a couple of times, before hiding. The correct initial state of that small title should be hidden, without animating in and out. We found out that the extra animations are probably related to Suspense, since when we removed the Suspense from the screen it animated in and out only one time. It might be a bug in react-native-collapsible-tab-view and the way `scrollYCurrent` is initiated/updated.

For now we have added an if to check if the `scrollYCurrent` value jumped more than 40 from the last value (since that's the weird behaviour we noticed, it jumps 48 which is the header height, then back to 0, then back to 48, then back to 0). If that happens, we ignore the value. Otherwise we continue with the animation calculation.

## Specify RN version in android/build.gradle

#### When can we remove this:

When this issue is resolved, possibly when we upgrade one or more of: react native, expo, jdk version: https://github.com/expo/expo/issues/18129

#### Explanation/Context:

https://github.com/expo/expo/issues/18129
Android builds are failing on expo dependencies, adding the react native version fixes it.
