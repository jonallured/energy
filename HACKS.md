<!-- Template

## Title

#### When can we remove this:

Tell us when we can remove this hack.

#### Explanation/Context:

Explain why the hack was added.

-->

👀 See comment on top of file for template.

## Specify RN version in android/build.gradle

#### When can we remove this:

When this issue is resolved, possibly when we upgrade one or more of: react native, expo, jdk version: https://github.com/expo/expo/issues/18129

#### Explanation/Context:

https://github.com/expo/expo/issues/18129
Android builds are failing on expo dependencies, adding the react native version fixes it.

## Patch react-native-community cli script

#### When can we remove this:

When we stop removing flipper in ci or react native supports this without patching.

#### Explanation/Context:

This patch was added to skip the flipper pod installation in ci to save ci resources.
https://github.com/artsy/eigen/pull/6793
