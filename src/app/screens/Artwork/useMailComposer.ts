import { ArtworkQuery$data } from "__generated__/ArtworkQuery.graphql"
import { Artwork_artworkProps$data } from "__generated__/Artwork_artworkProps.graphql"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItemArtwork } from "app/system/store/Models/SelectModeModel"
import * as MailComposer from "expo-mail-composer"
import { Alert } from "react-native"

export const useMailComposer = () => {
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )
  const oneArtworkSubject = GlobalStore.useAppState((state) => state.email.oneArtworkSubject)
  const multipleArtworksBySameArtistSubject = GlobalStore.useAppState(
    (state) => state.email.multipleArtworksBySameArtistSubject
  )

  /**
   * Send email with artwork info, using a passed artwork object or the selected
   * items from the select mode session.
   */
  const sendMail = async (artwork?: ArtworkEmailSnippetProps) => {
    // Sending email from artwork screen
    if (artwork) {
      const { title, artistNames } = artwork

      const bodyHTML = getArtworkEmailTemplate(artwork)

      try {
        await MailComposer.composeAsync({
          subject: oneArtworkSubject
            .replace("$title", title ?? "")
            .replace("$artist", artistNames ?? ""),
          isHtml: true,
          body: bodyHTML,
        })
      } catch (error) {
        console.log("[useMailComposer] Error sending email:", error)

        alertOnEmailFailure()
      }

      // Sending email from select mode
    } else {
      const firstSelectedItem = selectedItems[0] as SelectedItemArtwork

      // One item
      if (selectedItems.length === 1) {
        const { title, artistNames } = firstSelectedItem

        const bodyHTML = getArtworkEmailTemplate(firstSelectedItem)

        try {
          await MailComposer.composeAsync({
            subject: oneArtworkSubject
              .replace("$title", title ?? "")
              .replace("$artist", artistNames ?? ""),
            isHtml: true,
            body: bodyHTML,
          })
        } catch (error) {
          console.log("[useMailComposer] Error sending email:", error)

          alertOnEmailFailure()
        }
        // Sending multiple items
      } else if (selectedItems.length > 1) {
        const artistNames = firstSelectedItem.artistNames
        let artworksInfoInHTML = ""

        selectedItems.map((selectedItem) => {
          artworksInfoInHTML += getArtworkEmailTemplate(
            selectedItem as typeof firstSelectedItem,
            false
          )
        })

        const bodyHTML = `
          <html>
            <body>
              <h1>${artistNames ?? ""}</h1>
              ${artworksInfoInHTML}
            </body>
          </html>
        `

        console.log(bodyHTML)

        try {
          await MailComposer.composeAsync({
            subject: multipleArtworksBySameArtistSubject.replace("$artist", artistNames ?? ""),
            isHtml: true,
            body: bodyHTML,
          })
        } catch (error) {
          console.log("[useMailComposer] Error sending email:", error)

          alertOnEmailFailure()
        }
      }
    }
  }

  return {
    sendMail,
  }
}

export type ArtworkEmailSnippetProps = Omit<
  Artwork_artworkProps$data & NonNullable<ArtworkQuery$data["artwork"]>,
  " $fragmentSpread" | " $fragmentType"
>

export function getArtworkEmailTemplate(artwork: ArtworkEmailSnippetProps, fullHtml = true) {
  if (!artwork) {
    return ""
  }

  const {
    title,
    artistNames,
    price,
    dimensions,
    date,
    image,
    medium,
    mediumType,
    published,
    href,
  } = artwork

  const snippet = `
    <img
      height="60%"
      src="${image?.resized?.url ? image?.resized?.url : ""}"
    />
    <h1>${artistNames ?? ""}</h1>
    <p>${title ?? ""}, ${date ? date : ""}</p>
    <p>${price ?? ""}</p>
    <p>${mediumType?.name ?? ""}</p>
    <p>${medium ?? ""}</p>
    <p>${dimensions?.cm ?? ""}</p>
    ${published ? `<a href="https://www.artsy.net${href}>View on Artsy</p>` : ""}
`

  const htmlWrapper = fullHtml ? `<html><body>${snippet}</body></html>` : snippet
  return htmlWrapper
}

const alertOnEmailFailure = () => {
  Alert.alert("Error sending email, please try again.", "", [
    {
      text: "OK",
      style: "cancel",
    },
  ])
}
