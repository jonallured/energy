import { Alert, Platform } from "react-native"
import RNHTMLtoPDF from "react-native-html-to-pdf"
import Mailer from "react-native-mail"
import { GlobalStore, __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import {
  getArtworkEmailTemplate,
  replaceWhitespace,
  useMailComposer,
} from "utils/hooks/useMailComposer"

jest.mock("system/store/GlobalStore")

describe("useMailComposer", () => {
  const mockUseAppState = GlobalStore.useAppState as jest.MockedFunction<
    typeof GlobalStore.useAppState
  >

  const emailSettings = {
    ccRecipients: "cc@example.com",
    greetings: "Here is more information about the artwork(s) we discussed.",
    signature: "Some signature",
    oneArtworkSubject: "More information about $title by $artist.",
    multipleArtworksAndArtistsSubject:
      "More information about the artworks we discussed.",
    multipleArtworksBySameArtistSubject:
      "More information about $artist's artworks.",
    activePartnerID: "1234",
    activePartnerName: "Test Partner",
    activePartnerSlug: "test-partner",
  }

  beforeEach(() => {
    Platform.OS = "ios"
    mockUseAppState.mockImplementation(() => emailSettings)
  })

  afterEach(() => {
    Platform.OS = "ios"
    jest.clearAllMocks()
  })

  describe("sendMail", () => {
    it("should call MailComposer with correct params when sending a single artwork", () => {
      const ccRecipients = ["cc@example.com"]
      const subject = "More information about Artwork Title by Artist Name."
      const body = replaceWhitespace(
        '<html><body><div width="100%" style="text-align:right"><img style=\'width: 100px; height: 33px;\' src="https://d7hftxdivxxvm.cloudfront.net/?height=66&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fartsy-logo-1706648712115.png&width=200" /></div><br /><p><b>From [object Object]:</b></p><p> Here is more information about the artwork(s) we discussed. </p><br /><br /><p><b>Artist Name</b><br /> Artwork Title <br /><br /></p><br/><p>Some signature</p><p> Follow <a href=\'https://www.artsy.net/partner/[object Object]\'>[object Object]</a> on Artsy for more works and shows. </p></body></html>'
      )
      const artworks = [
        {
          title: "Artwork Title",
          artistNames: "Artist Name",
        },
      ]

      const mail = jest.fn()
      jest.spyOn(Mailer, "mail").mockImplementation(mail)

      useMailComposer().sendMail({ artworks } as any)

      expect(mail).toHaveBeenCalledWith(
        {
          isHTML: true,
          body,
          ccRecipients,
          subject,
        },
        // callback function
        expect.any(Function)
      )
    })

    it("should call MailComposer with correct params when sending multiple artworks", async () => {
      const ccRecipients = ["cc@example.com"]
      const subject = "More information about Artist A's artworks."
      const body = replaceWhitespace(
        '<html><body><div width="100%" style="text-align:right"><img style=\'width: 100px; height: 33px;\' src="https://d7hftxdivxxvm.cloudfront.net/?height=66&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fartsy-logo-1706648712115.png&width=200" /></div><br /><p><b>From [object Object]:</b></p><p>Here is more information about the artwork(s) we discussed.</p><br/><br /><p><b>Artist A</b><br /> Artwork Title 1 <br /><br /></p><br/><br/><br /><p><b>Artist A</b><br /> Artwork Title 2 <br /><br /></p><br/><br/><br/><p>Some signature</p><p> Follow <a href=\'https://www.artsy.net/partner/[object Object]\'>[object Object]</a> on Artsy for more works and shows. </p></body></html>'
      )
      const artworks = [
        {
          title: "Artwork Title 1",
          artistNames: "Artist A",
        },
        {
          title: "Artwork Title 2",
          artistNames: "Artist A",
        },
      ]

      const mail = jest.fn()
      jest.spyOn(Mailer, "mail").mockImplementation(mail)

      await useMailComposer().sendMail({ artworks } as any)

      expect(mail).toHaveBeenCalledWith(
        {
          isHTML: true,
          body,
          ccRecipients,
          subject,
        },
        // callback function
        expect.any(Function)
      )
    })

    it("it doesnt send empty string cc recipients", () => {
      mockUseAppState.mockImplementation(() => ({
        ...emailSettings,
        ccRecipients: "",
      }))

      const subject = "More information about Artwork Title by Artist Name."
      const body = replaceWhitespace(
        '<html><body><div width="100%" style="text-align:right"><img style=\'width: 100px; height: 33px;\' src="https://d7hftxdivxxvm.cloudfront.net/?height=66&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fartsy-logo-1706648712115.png&width=200" /></div><br /><p><b>From [object Object]:</b></p><p> Here is more information about the artwork(s) we discussed. </p><br /><br /><p><b>Artist Name</b><br /> Artwork Title <br /><br /></p><br/><p>Some signature</p><p> Follow <a href=\'https://www.artsy.net/partner/[object Object]\'>[object Object]</a> on Artsy for more works and shows. </p></body></html>'
      )
      const artworks = [
        {
          title: "Artwork Title",
          artistNames: "Artist Name",
        },
      ]

      const mail = jest.fn()
      jest.spyOn(Mailer, "mail").mockImplementation(mail)

      useMailComposer().sendMail({ artworks } as any)

      expect(mail).toHaveBeenCalledWith(
        {
          isHTML: true,
          recipients: undefined,
          subject,
          body,
        },
        expect.any(Function)
      )
    })

    describe("errors", () => {
      it("should call alertOnEmailFailure when there is an error sending the email", async () => {
        const artworks = [
          {
            title: "Artwork Title",
            artistNames: "Artist",
          },
        ]

        const mockError = new Error("Unknown error")

        jest.spyOn(Mailer, "mail").mockImplementation((options, callback) => {
          callback(mockError as any)
        })

        const alertOnEmailFailureMock = jest.fn()
        jest.spyOn(Alert, "alert").mockImplementation(alertOnEmailFailureMock)

        await useMailComposer().sendMail({ artworks } as any)

        expect(alertOnEmailFailureMock).toHaveBeenCalledWith(
          "Error sending email: Error: Unknown error",
          "",
          [{ style: "cancel", text: "OK" }]
        )
      })
    })

    it("sends specific message if users default email client isnt set up", async () => {
      const artworks = [
        {
          title: "Artwork Title",
          artistNames: "Artist",
        },
      ]

      const mockError = "not_available"

      jest.spyOn(Mailer, "mail").mockImplementation((options, callback) => {
        callback(mockError as any)
      })

      const alertOnEmailFailureMock = jest.fn()
      jest.spyOn(Alert, "alert").mockImplementation(alertOnEmailFailureMock)

      await useMailComposer().sendMail({ artworks } as any)

      expect(alertOnEmailFailureMock).toHaveBeenCalledWith(
        "Set up your Apple Mail app to send artworks by email.",
        "",
        [{ style: "cancel", text: "OK" }]
      )
    })
  })

  describe("sendMail on Android", () => {
    let convertMock: any

    beforeEach(() => {
      Platform.OS = "android"

      convertMock = jest.spyOn(RNHTMLtoPDF, "convert")
      convertMock.mockImplementation(() =>
        Promise.resolve({ filePath: "path/to/test.pdf" })
      )
    })

    afterEach(() => {
      Platform.OS = "ios"
      convertMock.mockRestore()
      jest.clearAllMocks()
    })

    it("should call MailComposer with correct params for a single artwork as a PDF", async () => {
      const ccRecipients = ["cc@example.com"]
      const subject = "More information about Artwork Title by Artist Name."
      const artworks = [{ title: "Artwork Title", artistNames: "Artist Name" }]

      const mail = jest.fn()
      jest.spyOn(Mailer, "mail").mockImplementation(mail)

      await useMailComposer().sendMail({ artworks } as any)

      expect(convertMock).toHaveBeenCalled()
      expect(mail).toHaveBeenCalledWith(
        expect.objectContaining({
          isHTML: true,
          body: "Please see attached artworks.",
          attachments: [{ path: "path/to/test.pdf", type: "pdf" }],
          ccRecipients,
          subject,
        }),
        expect.any(Function)
      )
    })

    it("should call MailComposer with correct params for multiple artworks as a PDF", async () => {
      const ccRecipients = ["cc@example.com"]
      const subject = "More information about Artist A's artworks."
      const artworks = [
        { title: "Artwork Title 1", artistNames: "Artist A" },
        { title: "Artwork Title 2", artistNames: "Artist A" },
      ]

      const mail = jest.fn()
      jest.spyOn(Mailer, "mail").mockImplementation(mail)

      await useMailComposer().sendMail({ artworks } as any)

      expect(RNHTMLtoPDF.convert).toHaveBeenCalled()
      expect(mail).toHaveBeenCalledWith(
        expect.objectContaining({
          isHTML: true,
          body: "Please see attached artworks.",
          attachments: [{ path: "path/to/test.pdf", type: "pdf" }],
          ccRecipients,
          subject,
        }),
        expect.any(Function)
      )
    })
  })

  describe("getArtworkEmailTemplate", () => {
    const artwork = {
      title: "The Starry Night",
      artistNames: "Vincent van Gogh",
      price: "$10,000",
      dimensions: { in: "28 x 36 in" },
      date: "1889",
      image: { resized: { url: "https://example.com/starry_night.jpg" } },
      medium: "Oil on canvas",
      mediumType: { name: "Painting" },
      published: true,
      href: "/artwork/vincent-van-gogh-the-starry-night",
    } as SelectedItemArtwork

    it("returns an empty string when no artwork is provided", () => {
      expect(
        getArtworkEmailTemplate({ artwork: null, emailSettings } as any)
      ).toBe("")
    })

    it("returns an HTML template with the correct content when fullHtml is true", () => {
      const expectedHtml = replaceWhitespace(`
        <html><body><p><b>From Test Partner:</b></p><p> Here is more information about the artwork(s) we discussed. </p><br /><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p><br/><p>Some signature</p><p> Follow <a href='https://www.artsy.net/partner/foo'>Test Partner</a> on Artsy for more works and shows. </p></body></html>
      `)

      expect(
        getArtworkEmailTemplate({
          artwork,
          fullHtml: true,
          partnerName: "Test Partner",
          partnerSlug: "foo",
          emailSettings,
        } as any)
      ).toBe(expectedHtml)
    })

    it("returns a snippet of HTML when fullHtml is false", () => {
      const expectedSnippet = replaceWhitespace(`
        <a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p>
      `)

      expect(
        getArtworkEmailTemplate({
          artwork,
          fullHtml: false,
          emailSettings,
        } as any)
      ).toBe(expectedSnippet)
    })

    describe("omits fields for missing data", () => {
      it("greeting", () => {
        const expectedHtml = replaceWhitespace(`
        <html><body><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p><br/><p>Some signature</p><p> Follow <a href='https://www.artsy.net/partner/foo'>Test Partner</a> on Artsy for more works and shows. </p></body></html>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork,
            fullHtml: true,
            partnerName: "Test Partner",
            partnerSlug: "foo",
            emailSettings: {
              ...emailSettings,
              greetings: null,
            },
          } as any)
        ).toBe(expectedHtml)
      })

      it("signature", () => {
        const expectedHtml = replaceWhitespace(`
        <html><body><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p><p> Follow <a href='https://www.artsy.net/partner/foo'>Test Partner</a> on Artsy for more works and shows. </p></body></html>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork,
            fullHtml: true,
            partnerName: "Test Partner",
            partnerSlug: "foo",
            emailSettings: {
              ...emailSettings,
              greetings: null,
              signature: null,
            },
          } as any)
        ).toBe(expectedHtml)
      })

      it("img", () => {
        const expectedSnippet = replaceWhitespace(`
        <br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              image: null,
            },
            fullHtml: false,
            emailSettings,
          })
        ).toBe(expectedSnippet)
      })

      it("title", () => {
        const expectedSnippet = replaceWhitespace(`
        <a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              title: null,
            },
            fullHtml: false,
            emailSettings,
          })
        ).toBe(expectedSnippet)
      })

      it("date", () => {
        const expectedSnippet = replaceWhitespace(`
        <a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> The Starry Night <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              date: null,
            },
            fullHtml: false,
            emailSettings,
          })
        ).toBe(expectedSnippet)
      })

      it("artistNames", () => {
        const expectedSnippet = replaceWhitespace(`
        <a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              artistNames: null,
            },
            fullHtml: false,
            emailSettings,
          })
        ).toBe(expectedSnippet)
      })

      it("price", () => {
        const expectedSnippet = replaceWhitespace(`
        <a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              price: null,
            },
            fullHtml: false,
            emailSettings,
          })
        ).toBe(expectedSnippet)
      })

      it("price exists, but presentation mode has it turned off", () => {
        const expectedSnippet = replaceWhitespace(`
        <a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              price: "$100",
            },
            fullHtml: false,
            emailSettings,
            presentationModeSettings: {
              isHidePriceEnabled: true,
            } as any,
          })
        ).toBe(expectedSnippet)
      })

      it("mediumType", () => {
        const expectedSnippet = replaceWhitespace(`
        <a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              mediumType: null,
            },
            fullHtml: false,
            emailSettings,
          })
        ).toBe(expectedSnippet)
      })

      it("medium", () => {
        const expectedSnippet = replaceWhitespace(`
        <a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> 28 x 36 in<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              medium: null,
            },
            fullHtml: false,
            emailSettings,
          })
        ).toBe(expectedSnippet)
      })

      it("dimensions", () => {
        const expectedSnippet = replaceWhitespace(`
        <a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\"><img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /></a><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /></p><p><a href=\"https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night\">View on Artsy</a></p>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              dimensions: null,
            },
            fullHtml: false,
            emailSettings,
          })
        ).toBe(expectedSnippet)
      })

      it("published", () => {
        const expectedSnippet = replaceWhitespace(`
        <img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              published: false,
            },
            fullHtml: false,
            emailSettings,
          })
        ).toBe(expectedSnippet)
      })

      describe("edition sets", () => {
        it("shows all fields", () => {
          const expectedSnippet = replaceWhitespace(`
            <img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><b>Editions</b><br /> 11 x 14 in<br /> 28 x 36 cm<br /> 10 of 20<br /> Some sale message<br /> $200<br /><br /></p>
          `)

          expect(
            getArtworkEmailTemplate({
              artwork: {
                ...artwork,
                published: false,
                editionSets: [
                  {
                    dimensions: {
                      cm: "28 x 36 cm",
                      in: "11 x 14 in",
                    },
                    editionOf: "10 of 20",
                    internalDisplayPrice: null,
                    price: "$200",
                    saleMessage: "Some sale message",
                  },
                ],
              },
              fullHtml: false,
              emailSettings,
            })
          ).toBe(expectedSnippet)
        })
      })

      it("hides in", () => {
        const expectedSnippet = replaceWhitespace(`
          <img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><b>Editions</b><br /> 28 x 36 cm<br /> 10 of 20<br /> Some sale message<br /> $200<br /><br /></p>
        `)

        expect(
          getArtworkEmailTemplate({
            artwork: {
              ...artwork,
              published: false,
              editionSets: [
                {
                  dimensions: {
                    cm: "28 x 36 cm",
                    in: "",
                  },
                  editionOf: "10 of 20",
                  internalDisplayPrice: null,
                  price: "$200",
                  saleMessage: "Some sale message",
                },
              ],
            },
            fullHtml: false,
            emailSettings,
          })
        ).toBe(expectedSnippet)
      })
    })

    it("hides cm", () => {
      const expectedSnippet = replaceWhitespace(`
        <img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><b>Editions</b><br /> 28 x 36 in<br /> 10 of 20<br /> Some sale message<br /> $200<br /><br /></p>
      `)

      expect(
        getArtworkEmailTemplate({
          artwork: {
            ...artwork,
            published: false,
            editionSets: [
              {
                dimensions: {
                  cm: "",
                  in: "28 x 36 in",
                },
                editionOf: "10 of 20",
                internalDisplayPrice: null,
                price: "$200",
                saleMessage: "Some sale message",
              },
            ],
          },
          fullHtml: false,
          emailSettings,
        })
      ).toBe(expectedSnippet)
    })

    it("hides editionOf", () => {
      const expectedSnippet = replaceWhitespace(`
        <img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><b>Editions</b><br /> 28 x 36 in<br /> 128 x 236 cm<br /> Some sale message<br /> $200<br /><br /></p>
      `)

      expect(
        getArtworkEmailTemplate({
          artwork: {
            ...artwork,
            published: false,
            editionSets: [
              {
                dimensions: {
                  cm: "128 x 236 cm",
                  in: "28 x 36 in",
                },
                editionOf: "",
                internalDisplayPrice: null,
                price: "$200",
                saleMessage: "Some sale message",
              },
            ],
          },
          fullHtml: false,
          emailSettings,
        })
      ).toBe(expectedSnippet)
    })

    it("hides saleMessage", () => {
      const expectedSnippet = replaceWhitespace(`
        <img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><b>Editions</b><br /> 28 x 36 in<br /> 128 x 236 cm<br /> 10 of 20<br /> $200<br /><br /></p>
      `)

      expect(
        getArtworkEmailTemplate({
          artwork: {
            ...artwork,
            published: false,
            editionSets: [
              {
                dimensions: {
                  cm: "128 x 236 cm",
                  in: "28 x 36 in",
                },
                editionOf: "10 of 20",
                internalDisplayPrice: null,
                price: "$200",
                saleMessage: "",
              },
            ],
          },
          fullHtml: false,
          emailSettings,
        })
      ).toBe(expectedSnippet)
    })

    it("hides price", () => {
      const expectedSnippet = replaceWhitespace(`
        <img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> $10,000<br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><b>Editions</b><br /> 28 x 36 in<br /> 128 x 236 cm<br /> 10 of 20<br /> Some sale message<br /><br /></p>
      `)

      expect(
        getArtworkEmailTemplate({
          artwork: {
            ...artwork,
            published: false,
            editionSets: [
              {
                dimensions: {
                  cm: "128 x 236 cm",
                  in: "28 x 36 in",
                },
                editionOf: "10 of 20",
                internalDisplayPrice: null,
                price: "",
                saleMessage: "Some sale message",
              },
            ],
          },
          fullHtml: false,
          emailSettings,
        })
      ).toBe(expectedSnippet)
    })

    it("hides price, but when presentation mode setting has turned it off", () => {
      const expectedSnippet = replaceWhitespace(`
        <img style=\"width: 100%; max-width: 600px;\" src=\"https://example.com/starry_night.jpg\" /><br /><p><b>Vincent van Gogh</b><br /> The Starry Night, 1889 <br /><br /> Painting<br /> Oil on canvas<br /> 28 x 36 in<br /></p><p><b>Editions</b><br /> 28 x 36 in<br /> 128 x 236 cm<br /> 10 of 20<br /> Some sale message<br /><br /></p>
      `)

      expect(
        getArtworkEmailTemplate({
          artwork: {
            ...artwork,
            published: false,
            editionSets: [
              {
                dimensions: {
                  cm: "128 x 236 cm",
                  in: "28 x 36 in",
                },
                editionOf: "10 of 20",
                internalDisplayPrice: null,
                price: "$100",
                saleMessage: "Some sale message",
              },
            ],
          },
          fullHtml: false,
          emailSettings,
          presentationModeSettings: {
            isHidePriceEnabled: true,
          } as any,
        })
      ).toBe(expectedSnippet)
    })
  })
})
