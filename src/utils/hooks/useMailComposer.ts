import { useToast } from "components/Toast/ToastContext"
import { FilterActionTypes, StateMapper } from "easy-peasy"
import { uniq } from "lodash"
import { Alert, Platform } from "react-native"
import RNHTMLtoPDF from "react-native-html-to-pdf"
import Mailer from "react-native-mail"
import { getEditionSetInfo } from "screens/Artwork/ArtworkContent/ArtworkContent"
import {
  TrackSentContentProps,
  useAppTracking,
} from "system/hooks/useAppTracking"
import { ScreenTypes } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { EmailModel } from "system/store/Models/EmailModel"
import { PresentationModeModel } from "system/store/Models/PresentationModeModel"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"

export const useMailComposer = () => {
  const emailSettings = GlobalStore.useAppState((state) => state.email)
  const presentationModeSettings = GlobalStore.useAppState(
    (state) => state.presentationMode
  )
  const partnerName = GlobalStore.useAppState(
    (state) => state.auth.activePartnerName
  )
  const partnerSlug = GlobalStore.useAppState(
    (state) => state.auth.activePartnerSlug
  )
  const { toast } = useToast()
  const { trackSentContent } = useAppTracking()

  /**
   * Send email with artwork info, using a passed artwork object or the selected
   * items from the select mode session.
   */
  const sendMail = async (props: {
    artworks: SelectedItemArtwork[]
    type: ScreenTypes
    albumId?: string
  }) => {
    const artworksToMail = props.artworks
    const firstSelectedItem = artworksToMail[0]
    const ccRecipients = emailSettings.ccRecipients
      ? [emailSettings.ccRecipients]
      : undefined

    // One item
    if (artworksToMail.length === 1) {
      const { title, artistNames } = firstSelectedItem

      const subject = emailSettings.oneArtworkSubject
        .replace("$title", title ?? "")
        .replace("$artist", artistNames ?? "")

      const htmlContent = getArtworkEmailTemplate({
        artwork: firstSelectedItem,
        emailSettings,
        presentationModeSettings,
        includeLogo: true,
        partnerName,
        partnerSlug,
      })

      const body =
        Platform.OS === "ios" ? htmlContent : "Please see attached artworks."

      const attachments =
        Platform.OS === "ios"
          ? undefined
          : await getHTMLPDFAttachment(htmlContent)

      log(subject, body, ccRecipients)

      emailComposer({
        subject,
        ccRecipients,
        body,
        isHTML: true,
        attachments,
        toast,
        artworksToMail,
        albumId: props.albumId,
        trackSentContent,
      })

      // Sending multiple items
    } else if (artworksToMail.length > 1) {
      let aggregatedArtworks = ""

      artworksToMail.map((selectedItem) => {
        aggregatedArtworks += getArtworkEmailTemplate({
          artwork: selectedItem,
          fullHtml: false,
          emailSettings,
          presentationModeSettings,
          partnerName,
          partnerSlug,
        })

        aggregatedArtworks += "<br/><br/>"
      })

      const subject = (() => {
        const artistNames = uniq(
          artworksToMail.map((artwork) => artwork.artistNames)
        )

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

      const htmlContent = replaceWhitespace(
        `
        <html>
          <body>
            ${logoHtml}

            ${
              emailSettings.greetings
                ? `
                  ${
                    partnerName
                      ? `
                      <p>
                        <b>From ${partnerName}:</b>
                      </p>
                    `
                      : ""
                  }
                  <p>${emailSettings.greetings}</p>
                  <br/>
                `
                : ""
            }

            ${aggregatedArtworks}
            ${
              emailSettings.signature
                ? `<br/><p>${emailSettings.signature}</p>`
                : ""
            }

            ${
              partnerSlug && partnerName
                ? `
                  <p>
                    Follow <a href='https://www.artsy.net/partner/${partnerSlug}'>${partnerName}</a> on Artsy for more works and shows.
                  </p>
                  `
                : ""
            }
          </body>
        </html>
      ` // Remove tagged template whitespace
          .replace(/\s+/g, " ")
          .trim()
      )

      const body =
        Platform.OS === "ios" ? htmlContent : "Please see attached artworks."
      const attachments =
        Platform.OS === "ios"
          ? undefined
          : await getHTMLPDFAttachment(htmlContent)

      log(subject, body, ccRecipients)

      emailComposer({
        subject,
        ccRecipients,
        body,
        isHTML: true,
        attachments,
        toast,
        artworksToMail,
        albumId: props.albumId,
        trackSentContent,
      })
    }
  }

  return {
    sendMail,
  }
}

const logoHtml = `
  <div width="100%" style="text-align:right">
    <img style='width: 100px; height: 33px;' src="https://d7hftxdivxxvm.cloudfront.net/?height=66&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fartsy-logo-1706648712115.png&width=200" />
  </div>

  <br />
`

interface EmailComposerProps {
  subject: string
  ccRecipients?: string[]
  body: string
  isHTML: boolean
  attachments?: any[]
  toast: ReturnType<typeof useToast>["toast"]
  trackSentContent: (props: TrackSentContentProps) => void
  artworksToMail: SelectedItemArtwork[]
  albumId?: string
}

const emailComposer = ({
  subject,
  ccRecipients,
  body,
  isHTML,
  attachments,
  toast,
  trackSentContent,
  artworksToMail,
  albumId,
}: EmailComposerProps) => {
  Mailer.mail(
    {
      subject,
      ccRecipients,
      body,
      isHTML,
      attachments,
    },
    // Event is either `sent`, `saved`, `cancelled`, `failed` or `error`
    (error, event) => {
      if (!!error) {
        console.log(
          "[useMailComposer] Error sending email:",
          error,
          "event",
          event
        )
        alertOnEmailFailure(error)
      }

      const artworkIds = artworksToMail.map((artwork) => artwork.internalID)

      switch (event) {
        case "sent": {
          toast.show({
            title: "Email sent.",
            type: "info",
          })

          trackSentContent({
            artworkIds,
            albumId,
          })
          break
        }
        case "saved": {
          toast.show({
            title: "Email saved for later.",
            type: "info",
          })

          trackSentContent({
            artworkIds,
            albumId,
          })
          break
        }
        case "cancelled": {
          toast.show({
            title: "Email cancelled",
            type: "info",
          })
          break
        }
        case "failed": {
          console.log(
            "[useMailComposer] Error sending email:",
            error,
            "event",
            event
          )

          alertOnEmailFailure(error)
          break
        }
        default: {
          break
        }
      }
    }
  )
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
  presentationModeSettings,
  includeLogo = false,
  partnerName,
  partnerSlug,
}: {
  artwork: SelectedItemArtwork
  fullHtml?: boolean
  emailSettings: StateMapper<FilterActionTypes<EmailModel>>
  presentationModeSettings?: StateMapper<
    FilterActionTypes<PresentationModeModel>
  >
  includeLogo?: boolean
  partnerName?: string | null
  partnerSlug?: string | null
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

  let imageTag = ""

  if (imageSrc) {
    imageTag = `<img style="width: 100%; max-width: 600px;" src="${imageSrc}" />`

    if (published) {
      imageTag = `<a href="https://www.artsy.net${href}">${imageTag}</a>`
    }
  }

  const editionSetInfo = getEditionSetInfo(artwork)

  let editionSetText = ""

  editionSetInfo?.forEach((editionSet) => {
    editionSetText += `
      ${editionSet?.dimensions.in ? `${editionSet?.dimensions.in}<br />` : ""}
      ${editionSet?.dimensions.cm ? `${editionSet?.dimensions.cm}<br />` : ""}

      ${editionSet?.editionOf ? `${editionSet?.editionOf}<br />` : ""}

      ${editionSet?.saleMessage ? `${editionSet?.saleMessage}<br />` : ""}
      ${
        !presentationModeSettings?.isHidePriceEnabled && editionSet?.price
          ? `${editionSet?.price}<br />`
          : ""
      }

      <br />
    `
  })

  const snippet = `
    ${imageTag}

    <br />

    <p>
      ${artistNames ? `<b>${artistNames}</b><br />` : ""}

      ${(() => {
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
      })()}

      <br /><br />

      ${
        !presentationModeSettings?.isHidePriceEnabled && price
          ? `${price}<br />`
          : ""
      }
      ${mediumType?.name ? `${mediumType?.name}<br />` : ""}
      ${medium ? `${medium}<br />` : ""}
      ${dimensions?.in ? `${dimensions?.in}<br />` : ""}
    </p>

    ${
      artwork.editionSets?.length
        ? `
        <p>
          <b>Editions</b><br />

          ${editionSetText}
        </p>
      `
        : ""
    }

    ${
      published
        ? `<p><a href="https://www.artsy.net${href}">View on Artsy</a></p>`
        : ""
    }
`

  const htmlWrapper = (
    fullHtml
      ? `
        <html>
          <body>
            ${includeLogo ? logoHtml : ""}

            ${
              emailSettings.greetings
                ? `
                    ${
                      partnerName
                        ? `
                        <p>
                          <b>From ${partnerName}:</b>
                        </p>
                      `
                        : ""
                    }
                    <p>
                      ${emailSettings.greetings}
                    </p>
                    <br />
                  `
                : ""
            }
            ${snippet}
            ${
              emailSettings.signature
                ? `<br/><p>${emailSettings.signature}</p>`
                : ""
            }

            ${
              partnerSlug && partnerName
                ? `
                  <p>
                    Follow <a href='https://www.artsy.net/partner/${partnerSlug}'>${partnerName}</a> on Artsy for more works and shows.
                  </p>
                  `
                : ""
            }
          </body>
        </html>`
      : `
        ${snippet}
      `
  )
    // Remove tagged template whitespace
    .replace(/\s+/g, " ")
    .trim()

  return replaceWhitespace(htmlWrapper)
}

const alertOnEmailFailure = (error: any) => {
  const errorMessage = (() => {
    switch (error) {
      case "not_available": {
        return `Set up your ${
          Platform.OS === "ios" ? "Apple Mail" : "Gmail"
        } app to send artworks by email.`
      }
      default: {
        return `Error sending email: ${error}`
      }
    }
  })()

  Alert.alert(errorMessage, ``, [
    {
      text: "OK",
      style: "cancel",
    },
  ])
}

const log = (
  subject: string,
  body: string,
  ccRecipients: string[] | undefined
) => {
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

export const replaceWhitespace = (str: string) =>
  str.replace(/>\s+</g, "><").trim()
