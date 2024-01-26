import {
  Button,
  Flex,
  Input,
  Text,
  useColor,
  Spacer,
  Screen,
  SCREEN_HORIZONTAL_PADDING,
} from "@artsy/palette-mobile"
import { useFormik } from "formik"
import { useRef, useState } from "react"
import { Linking, Platform, TouchableOpacity } from "react-native"
import { useSetupRageShake } from "system/devTools/useSetupRageShake"
import { useAppTracking } from "system/hooks/useAppTracking"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { attemptAlbumMigration } from "utils/attemptAlbumMigration"
import { object, string } from "yup"

export interface LoginSchema {
  email: string
  password: string
  otp: string
}

export const loginSchema = object().shape({
  email: string().email("Please provide a valid email address"),
  password: string().test("password", "Password field is required", (value) => value !== ""),
  otp: string().test("otp", "This field is required", (value) => value !== ""),
})

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=net.artsy.app"
const PLAY_STORE_SCHEME_URL = "artsy://"
const APP_STORE_URL = "https://apps.apple.com/us/app/artsy-buy-sell-original-art/id703796080"
const APP_SCHEME_URL = "artsy:///"

export const LoginScreen = () => {
  useTrackScreen("Login")
  useSetupRageShake()

  const color = useColor()

  const { trackLoginSuccess } = useAppTracking()
  const passwordInputRef = useRef<Input>(null)
  const emailInputRef = useRef<Input>(null)
  const otpInputRef = useRef<Input>(null)
  const initialValues: LoginSchema = { email: "", password: "", otp: "" }

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

      if (success) {
        trackLoginSuccess()
        attemptAlbumMigration()
        return
      }

      if (["otp_missing", "on_demand_otp_missing", "invalid_otp"].includes(message)) {
        setErrors({ otp: "Incorrect authentication code" })
      } else {
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
    <Screen>
      <Text variant="lg" mx={SCREEN_HORIZONTAL_PADDING} my={1}>
        Folio
      </Text>
      <Screen.Body scroll>
        <Flex>
          <Text variant="xl">Log In</Text>
          <Text variant="md" mt={0.5}>
            With Your Artsy Partner Account
          </Text>

          <Spacer y={4} />

          <Input
            ref={emailInputRef}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={(text) => {
              handleChange("email")(text.trim())
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

          <Spacer y={2} />

          <Input
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            onChangeText={(text) => {
              // Hide error when the user starts to type again
              if (errors.password) {
                setErrors({ password: undefined })
                validateForm()
              }
              handleChange("password")(text)
            }}
            onSubmitEditing={() => handleSubmit()}
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
          {!!showOtpInputField && (
            <>
              <Spacer y={2} />
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
                onSubmitEditing={() => handleSubmit()}
                onBlur={() => validateForm()}
                placeholder="Enter an authentication code"
                placeholderTextColor={color("onBackgroundLow")}
                ref={otpInputRef}
                title="Authentication code"
                value={values.otp}
                error={errors.otp}
              />
            </>
          )}
        </Flex>

        <Spacer y={4} />

        <Button
          onPress={() => handleSubmit()}
          block
          haptic="impactMedium"
          disabled={!(isValid && dirty) || isSubmitting} // isSubmitting to prevent weird appearances of the errors caused by async submiting
          loading={isSubmitting}
          testID="loginButton"
          variant="fillDark"
        >
          Log in
        </Button>

        <Spacer y={2} />

        <Flex alignItems="center">
          <Text>Looking for Artsy Mobile?</Text>
          <TouchableOpacity onPress={handleOpenArtsyMobile}>
            <Text underline>Tap here to open</Text>
          </TouchableOpacity>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
