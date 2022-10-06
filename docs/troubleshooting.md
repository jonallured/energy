# Troubleshooting

The app isn't working?

Try the following

```
yarn setup:artsy

yarn install:all

```

run the app:

```
yarn start
yarn ios
```

you can also try

`yarn open-xcode`
and play button on xcode

❗️when you open xcode make sure you open `Energy.xcworkspace` and not `Energy.xcodeproj`

If this does not work, try deleting the app and installing it again.

## if tests are failing

Perhaps you need to add the library to `jest.config.js` on `transformIgnorePatterns`

https://stackoverflow.com/questions/55794280/jest-fails-with-unexpected-token-on-import-statement

Check which packages are showing up on the breaking tests and add them to `transformIgnorePatterns`
