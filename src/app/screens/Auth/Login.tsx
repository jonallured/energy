import { useFormik } from "formik"
import { useRef, useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Yup from "yup"
import { GlobalStore } from "app/store/GlobalStore"
import { Button, Flex, Input, Text, useColor } from "palette"
import { useScreenDimensions } from "shared/hooks"
import { MeasuredView } from "shared/utils"
import { Spacer } from "@artsy/palette-mobile"

export interface LoginSchema {
  email: string
  password: string
  otp: string
}

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address"),
  password: Yup.string().test("password", "Password field is required", (value) => value !== ""),
  otp: Yup.string().test("otp", "This field is required", (value) => value !== ""),
})

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=net.artsy.app"
const PLAY_STORE_SCHEME_URL = "artsy://"
const APP_STORE_URL = "https://apps.apple.com/us/app/artsy-buy-sell-original-art/id703796080"
const APP_SCHEME_URL = "artsy:///"

export const LoginScreen = () => {
  const color = useColor()
  const insets = useSafeAreaInsets()

  const passwordInputRef = useRef<Input>(null)
  const emailInputRef = useRef<Input>(null)
  const otpInputRef = useRef<Input>(null)
  const initialValues: LoginSchema = __DEV__
    ? {
        email: GlobalStore.useAppState((state) => state.auth.devEmail),
        password: GlobalStore.useAppState((state) => state.auth.devPassword),
        otp: "",
      }
    : { email: "", password: "", otp: "" }

  const [showOtpInputField, setShowOtpInputField] = useState(false)

  const {
    values,
    handleSubmit,
    handleChange,
    validateForm,
    errors,
    isValid,
    dirty,
    isSubmitting,
    setErrors,
  } = useFormik<LoginSchema>({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues,
    initialErrors: {},
    onSubmit: async ({ email, password, otp }, { setErrors, validateForm }) => {
      validateForm()
      const { success, message } = await GlobalStore.actions.auth.signInUsingEmail({
        email,
        password,
        otp: otp === "" ? undefined : otp.trim(),
      })

      if (message === "otp_missing" || message === "on_demand_otp_missing") {
        setShowOtpInputField(true)
        otpInputRef.current?.focus()
      }

      if (!success && message !== "otp_missing" && message !== "on_demand_otp_missing") {
        // For security purposes, we are returning a generic error message
        setErrors({ password: "Incorrect email or password" }) // pragma: allowlist secret
      }
    },
    validationSchema: loginSchema,
  })

  // TODO: Test this on Android
  const handleOpenArtsyMobile = async () => {
    const storeURL = Platform.OS === "android" ? PLAY_STORE_URL : APP_STORE_URL
    const appSchemeURL = Platform.OS === "android" ? PLAY_STORE_SCHEME_URL : APP_SCHEME_URL

    try {
      const supported = await Linking.canOpenURL(appSchemeURL)

      if (supported) {
        Linking.openURL(appSchemeURL)
      } else {
        Linking.openURL(storeURL)
      }
    } catch (error) {
      console.error("couldn't open artsy mobile app")
    }
  }

  return (
    <Flex flex={1} pt={insets.top} px={2} backgroundColor="background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="lg">Folio</Text>
          <Spacer mt={2} />
          <Text variant="xl">Log In</Text>
          <Text variant="md" mt={0.5}>
            With Your Artsy Partner Account
          </Text>
          <Spacer mt={4} />
          <Input
            ref={emailInputRef}
            autoCapitalize="none"
            autoCompleteType="email"
            keyboardType="email-address"
            onChangeText={(text) => {
              handleChange("email")(text.trim())
              GlobalStore.actions.auth.saveDevEmail(text)
            }}
            onSubmitEditing={() => {
              validateForm()
              passwordInputRef.current?.focus()
            }}
            onBlur={() => validateForm()}
            blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
            placeholder="Email address"
            title="Email"
            value={values.email}
            returnKeyType="next"
            spellCheck={false}
            autoCorrect={false}
            // We need to to set textContentType to username (instead of emailAddress) here
            // enable autofill of login details from the device keychain.
            textContentType="username"
            error={errors.email}
          />
          <Spacer mt={2} />
          <Input
            autoCapitalize="none"
            autoCompleteType="password"
            autoCorrect={false}
            onChangeText={(text) => {
              // Hide error when the user starts to type again
              GlobalStore.actions.auth.saveDevPassword(text)
              if (errors.password) {
                setErrors({
                  password: undefined,
                })
                validateForm()
              }
              handleChange("password")(text)
            }}
            onSubmitEditing={handleSubmit}
            onBlur={() => validateForm()}
            placeholder="Password"
            ref={passwordInputRef}
            secureTextEntry
            title="Password"
            // We need to to set textContentType to password here
            // enable autofill of login details from the device keychain.
            textContentType="password"
            value={values.password}
            error={errors.password}
          />
          {showOtpInputField && (
            <>
              <Spacer mt={2} />
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                onChangeText={(text) => {
                  // Hide error when the user starts to type again
                  if (errors.otp) {
                    setErrors({
                      otp: undefined,
                    })
                    validateForm()
                  }
                  handleChange("otp")(text)
                  if (__DEV__ && text.length > 5) {
                    handleSubmit()
                  }
                }}
                onSubmitEditing={handleSubmit}
                onBlur={() => validateForm()}
                placeholder="Enter an authentication code"
                placeholderTextColor={color("onBackgroundLow")}
                ref={otpInputRef}
                title="Authentication code"
                // We need to to set textContentType to password here
                // enable autofill of login details from the device keychain.
                value={values.otp}
                error={errors.otp}
              />
            </>
          )}
          {/* {!showOtpInputField && (
            <>
              <Spacer mt={1} />
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("Oups, not yet implemented")
                }}
              >
                <Text variant="xs" textAlign="right" underline color="onBackgroundMedium">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </>
          )} */}
          <Spacer mb={4} />
          <Button
            onPress={handleSubmit}
            block
            haptic="impactMedium"
            disabled={!(isValid && dirty) || isSubmitting} // isSubmitting to prevent weird appearances of the errors caused by async submiting
            loading={isSubmitting}
            testID="loginButton"
            variant="fillDark"
          >
            Log in
          </Button>
          <Spacer mt={2} />
          <Text variant="xs" pb={1} textAlign="center" color="onBackgroundMedium">
            Once you log in. Artsy Folio will begin downloading your artworks. We recommend using a
            stable Wifi connection.
          </Text>

          <CloseToTheBottomOfScrollView>
            <Flex px={2} pb={insets.bottom > 0 ? insets.bottom : 2} alignItems="center">
              <Text>Looking for Artsy Mobile?</Text>
              <TouchableOpacity onPress={handleOpenArtsyMobile}>
                <Text underline>Tap here to open</Text>
              </TouchableOpacity>
            </Flex>
          </CloseToTheBottomOfScrollView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Flex>
  )
}

const CloseToTheBottomOfScrollView = ({ children }: { children: React.ReactNode }) => {
  const { height: screenHeight } = useScreenDimensions()
  const saInsets = useSafeAreaInsets()
  const [viewSize, setViewSize] = useState({ width: 0, height: 0 })

  const inner = (
    <>
      {children}
      <Spacer pb={2} />
    </>
  )

  return (
    <>
      <MeasuredView setMeasuredState={setViewSize}>{inner}</MeasuredView>
      <Flex
        position="absolute"
        top={screenHeight - viewSize.height - saInsets.top - saInsets.bottom}
        width="100%"
      >
        {inner}
      </Flex>
    </>
  )
}
