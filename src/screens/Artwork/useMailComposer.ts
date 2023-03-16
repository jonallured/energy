import { FilterActionTypes, StateMapper } from "easy-peasy"
import * as MailComposer from "expo-mail-composer"
import { uniq } from "lodash"
import { Alert } from "react-native"
import { GlobalStore } from "system/store/GlobalStore"
import { EmailModel } from "system/store/Models/EmailModel"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"

export const useMailComposer = () => {
  const emailSettings = GlobalStore.useAppState((state) => state.email)

  /**
   * Send email with artwork info, using a passed artwork object or the selected
   * items from the select mode session.
   */
  const sendMail = async (props: { artworks: SelectedItemArtwork[] }) => {
    const artworksToMail = props.artworks
    const firstSelectedItem = artworksToMail[0]
    const ccRecipients = emailSettings.ccRecipients ? [emailSettings.ccRecipients] : undefined

    // One item
    if (artworksToMail.length === 1) {
      const { title, artistNames } = firstSelectedItem

      try {
        const subject = emailSettings.oneArtworkSubject
          .replace("$title", title ?? "")
          .replace("$artist", artistNames ?? "")

        const body = getArtworkEmailTemplate({ artwork: firstSelectedItem, emailSettings })

        log(subject, body, ccRecipients)

        await MailComposer.composeAsync({
          isHtml: true,
          subject,
          body,
          ccRecipients,
        })

        // TODO: Pending design feedback
        // toast.show({
        //   title: "Email sent.",
        //   type: "info",
        // })
      } catch (error) {
        console.log("[useMailComposer] Error sending email:", error)

        alertOnEmailFailure(error)
      }
      // Sending multiple items
    } else if (artworksToMail.length > 1) {
      let aggregatedArtworks = ""

      artworksToMail.map((selectedItem) => {
        aggregatedArtworks += getArtworkEmailTemplate({
          artwork: selectedItem,
          fullHtml: false,
          emailSettings,
        })
      })

      const subject = (() => {
        const artistNames = uniq(artworksToMail.map((artwork) => artwork.artistNames))

        switch (true) {
          case artistNames.length === 1: {
            return emailSettings.multipleArtworksBySameArtistSubject.replace(
              "$artist",
              artistNames[0] ?? ""
            )
          }
          case artistNames.length > 1: {
            return emailSettings.multipleArtworksAndArtistsSubject
          }
          default: {
            return ""
          }
        }
      })()

      const body = `
        <html>
          <body>
            ${emailSettings.greetings ? `<p>${emailSettings.greetings}</p><br/>` : ""}
            ${aggregatedArtworks}
            ${emailSettings.signature ? `<br/><p>${emailSettings.signature}</p>` : ""}
          </body>
        </html>
      ` // Remove tagged template whitespace
        .replace(/\s+/g, " ")
        .trim()

      try {
        log(subject, body, ccRecipients)

        await MailComposer.composeAsync({
          isHtml: true,
          ccRecipients,
          subject,
          body,
        })

        // TODO: Pending design feedback
        // toast.show({
        //   title: "Email sent.",
        //   type: "info",
        // })
      } catch (error) {
        console.log("[useMailComposer] Error sending email:", error)

        alertOnEmailFailure(error)
      }
    }
  }

  return {
    sendMail,
  }
}

export const getArtworkEmailTemplate = ({
  artwork,
  fullHtml = true,
  emailSettings,
}: {
  artwork: SelectedItemArtwork
  fullHtml?: boolean
  emailSettings: StateMapper<FilterActionTypes<EmailModel>>
}) => {
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
    ${
      image?.resized?.url
        ? `<img
            height="60%"
            src="${image?.resized?.url}"
          />`
        : ""
    }

    ${artistNames ? `<h1>${artistNames}</h1>` : ""}

    <p>${(() => {
      let titleAggregator = ""
      if (title && date) {
        titleAggregator = title + ", " + date
      } else if (title && !date) {
        titleAggregator += title
      } else if (!title && date) {
        titleAggregator += date
      } else {
        titleAggregator = ""
      }
      return titleAggregator
    })()}</p>

    ${price ? `<p>${price}</p>` : ""}
    ${mediumType?.name ? `<p>${mediumType?.name}</p>` : ""}
    ${medium ? `<p>${medium}</p>` : ""}
    ${dimensions?.in ? `<p>${dimensions?.in}</p>` : ""}
    ${published ? `<a href="https://www.artsy.net${href}">View on Artsy</a>` : ""}
`

  const htmlWrapper = (
    fullHtml
      ? `
        <html>
          <body>
            ${emailSettings.greetings ? `<p>${emailSettings.greetings}</p><br />` : ""}
            ${snippet}
            ${emailSettings.signature ? `<br/><p>${emailSettings.signature}</p>` : ""}
          </body>
        </html>`
      : snippet
  )
    // Remove tagged template whitespace
    .replace(/\s+/g, " ")
    .trim()

  return htmlWrapper
}

const alertOnEmailFailure = (error: any) => {
  Alert.alert("Email not sent.", error.message, [
    {
      text: "OK",
      style: "cancel",
    },
  ])
}

const log = (subject: string, body: string, ccRecipients: string[] | undefined) => {
  if (__DEV__ && !__TEST__) {
    console.log(
      "[useMailComposer] Sending email:",
      {
        subject,
        ccRecipients,
      },
      body
    )
  }
}
