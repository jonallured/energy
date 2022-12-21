import { Flex, ProgressBar } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { WebView } from "react-native-webview"
import { NavigationScreens } from "app/Navigation"
import { GlobalStore } from "app/system/store/GlobalStore"
import { Screen } from "palette"

type ArtworkWebViewRoute = RouteProp<NavigationScreens, "ArtworkWebView">

export const ArtworkWebView = () => {
  const { params } = useRoute<ArtworkWebViewRoute>()
  const [loadProgress, setLoadProgress] = useState<number>(0)
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(true)
  const { webURL } = GlobalStore.useAppState((store) => store.config.environment.strings)
  const uri = params.uri.startsWith("/") ? webURL + params.uri : params.uri

  return (
    <Screen>
      <Screen.Header />
      <Screen.Body fullwidth>
        <WebView
          source={{ uri }}
          sharedCookiesEnabled
          onLoadProgress={(e) => setLoadProgress(e.nativeEvent.progress)}
          onLoad={() => setIsProgressBarVisible(false)}
        />
        {isProgressBarVisible && (
          <Flex height="100%">
            <ProgressBar progress={loadProgress} />
          </Flex>
        )}
      </Screen.Body>
    </Screen>
  )
}

export function useWebViewCookies() {
  const accesstoken = GlobalStore.useAppState((store) => store.auth.userAccessToken)
  const isLoggedIn = !!accesstoken
  const { webURL, predictionURL } = GlobalStore.useAppState(
    (store) => store.config.environment.strings
  )
  useUrlCookies(webURL, accesstoken, isLoggedIn)
  useUrlCookies(predictionURL + "/login", accesstoken, isLoggedIn)
}

function useUrlCookies(url: string, accessToken: string | null, isLoggedIn: boolean) {
  useEffect(() => {
    if (accessToken && isLoggedIn) {
      const attempt = new CookieRequestAttempt(url, accessToken)
      attempt.makeAttempt()
      return () => {
        attempt.invalidated = true
      }
    }
  }, [accessToken, isLoggedIn, url])
}
class CookieRequestAttempt {
  invalidated = false
  constructor(public url: string, public accessToken: string) {}
  async makeAttempt() {
    if (this.invalidated) {
      return
    }
    try {
      const res = await fetch(this.url, {
        method: "HEAD",
        headers: { "X-Access-Token": this.accessToken },
      })
      console.log("Res :: ", res)
      if (this.invalidated) {
        return
      }

      if (res.status > 400) {
        throw new Error("couldn't authenticate")
      }
      console.log({ message: `Successfully set up artsy web view cookies for ${this.url}` })
    } catch (e) {
      if (this.invalidated) {
        return
      }
      console.log({
        message: `Retrying to set up artsy web view cookies in 20 seconds ${this.url}`,
      })
      setTimeout(() => this.makeAttempt(), 1000 * 20)
    }
  }
}
