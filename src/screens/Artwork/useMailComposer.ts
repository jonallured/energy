import { useToast } from "components/Toast/ToastContext"
import { FilterActionTypes, StateMapper } from "easy-peasy"
import { uniq } from "lodash"
import { Alert, Platform } from "react-native"
import RNHTMLtoPDF from "react-native-html-to-pdf"
import Mailer from "react-native-mail"
import { GlobalStore } from "system/store/GlobalStore"
import { EmailModel } from "system/store/Models/EmailModel"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"

interface EmailComposerProps {
  subject: string
  ccRecipients?: string[]
  body: string
  isHTML: boolean
  attachments?: any[]
  toast: ReturnType<typeof useToast>["toast"]
}

const emailComposer = ({
  subject,
  ccRecipients,
  body,
  isHTML,
  attachments,
  toast,
}: EmailComposerProps) => {
  Mailer.mail(
    {
      subject,
      recipients: ccRecipients,
      body,
      isHTML,
      attachments,
    },
    // event is either `sent`, `saved`, `cancelled`, `failed` or `error`
    (error, event) => {
      if (!!error) {
        console.log("[useMailComposer] Error sending email:", error, "event", event)
        alertOnEmailFailure(error)
      }

      switch (event) {
        case "sent":
          toast.show({
            title: "Email sent.",
            type: "info",
          })
          break
        case "saved":
          toast.show({
            title: "Email saved for later.",
            type: "info",
          })
          break
        case "cancelled":
          toast.show({
            title: "Email cancelled",
            type: "error",
          })
          break
        case "failed":
          console.log("[useMailComposer] Error sending email:", error, "event", event)
          alertOnEmailFailure(error)
          break
        default:
          break
      }
    }
  )
}

export const useMailComposer = () => {
  const emailSettings = GlobalStore.useAppState((state) => state.email)
  const { toast } = useToast()

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

      const subject = emailSettings.oneArtworkSubject
        .replace("$title", title ?? "")
        .replace("$artist", artistNames ?? "")

      const htmlContent = getArtworkEmailTemplate({ artwork: firstSelectedItem, emailSettings })

      const body = Platform.OS === "ios" ? htmlContent : "Please see attached artworks."

      const attachments =
        Platform.OS === "ios" ? undefined : await getHTMLPDFAttachment(htmlContent)

      log(subject, body, ccRecipients)

      emailComposer({
        subject,
        ccRecipients,
        body,
        isHTML: true,
        attachments,
        toast,
      })

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

      const htmlContent = `
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

      const body = Platform.OS === "ios" ? htmlContent : "Please see attached artworks."
      const attachments =
        Platform.OS === "ios" ? undefined : await getHTMLPDFAttachment(htmlContent)

      log(subject, body, ccRecipients)

      emailComposer({
        subject,
        ccRecipients,
        body,
        isHTML: true,
        attachments,
        toast,
      })
    }
  }

  return {
    sendMail,
  }
}

const getHTMLPDFAttachment = async (htmlContent: string) => {
  const options = {
    html: htmlContent,
    fileName: "artworks",
    directory: "Documents",
  }

  const file = await RNHTMLtoPDF.convert(options)

  return [
    {
      path: file.filePath,
      type: "pdf",
    },
  ]
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

  // Android images need different constraints to not be cut off in PDF
  const imageSrc = image?.resized?.url
  const imageAttributes = Platform.OS === "ios" ? 'height="60%"' : 'style="max-width: 100%;"'
  const imageTag = imageSrc ? `<img ${imageAttributes} src="${imageSrc}" />` : ""

  const snippet = `
    ${imageTag}

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
