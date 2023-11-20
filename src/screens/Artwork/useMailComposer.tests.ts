import { Alert } from "react-native"
import Mailer from "react-native-mail"
import { getArtworkEmailTemplate, useMailComposer } from "screens/Artwork/useMailComposer"
import { GlobalStore, __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"

jest.mock("system/store/GlobalStore")

describe("useMailComposer", () => {
  const mockUseAppState = GlobalStore.useAppState as jest.MockedFunction<
    typeof GlobalStore.useAppState
  >
  const replaceWhitespace = (str: string) => str.replace(/\s+/g, " ").trim()

  const emailSettings = {
    ccRecipients: "cc@example.com",
    greetings: "Here is more information about the artwork(s) we discussed.",
    signature: "Some signature",
    oneArtworkSubject: "More information about $title by $artist.",
    multipleArtworksAndArtistsSubject: "More information about the artworks we discussed.",
    multipleArtworksBySameArtistSubject: "More information about $artist's artworks.",
  }

  beforeEach(() => {
    mockUseAppState.mockImplementation(() => emailSettings)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("sendMail", () => {
    it("should call MailComposer with correct params when sending a single artwork", () => {
      const recipients = ["cc@example.com"]
      const subject = "More information about Artwork Title by Artist Name."
      const body =
        "<html> <body> <p>Here is more information about the artwork(s) we discussed.</p><br /> <h1>Artist Name</h1> <p>Artwork Title</p> <br/><p>Some signature</p> </body> </html>"
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
          recipients,
          subject,
        },
        // callback function
        expect.any(Function)
      )
    })

    it("should call MailComposer with correct params when sending multiple artworks", async () => {
      const recipients = ["cc@example.com"]
      const subject = "More information about Artist A's artworks."
      const body =
        "<html> <body> <p>Here is more information about the artwork(s) we discussed.</p><br/> <h1>Artist A</h1> <p>Artwork Title 1</p><h1>Artist A</h1> <p>Artwork Title 2</p> <br/><p>Some signature</p> </body> </html>"
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
          recipients,
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
      const body =
        "<html> <body> <p>Here is more information about the artwork(s) we discussed.</p><br /> <h1>Artist Name</h1> <p>Artwork Title</p> <br/><p>Some signature</p> </body> </html>"
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

    it("should call alertOnEmailFailure when there is an error sending the email", async () => {
      const artworks = [
        {
          title: "Artwork Title",
          artistNames: "Artist",
        },
      ]

      const mockError = new Error("Failed to send email")

      jest.spyOn(Mailer, "mail").mockImplementation((options, callback) => {
        callback(mockError as any)
      })

      const alertOnEmailFailureMock = jest.fn()
      jest.spyOn(Alert, "alert").mockImplementation(alertOnEmailFailureMock)

      await useMailComposer().sendMail({ artworks } as any)

      expect(alertOnEmailFailureMock).toHaveBeenCalledWith(
        "Email not sent.",
        "Failed to send email",
        [{ style: "cancel", text: "OK" }]
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
      expect(getArtworkEmailTemplate({ artwork: null, emailSettings } as any)).toBe("")
    })

    it("returns an HTML template with the correct content when fullHtml is true", () => {
      const expectedHtml = replaceWhitespace(`
        <html>
          <body>
            <p>${emailSettings?.greetings}</p><br />
            <img
              height="60%"
              src="https://example.com/starry_night.jpg"
            />
            <h1>Vincent van Gogh</h1>
            <p>The Starry Night, 1889</p>
            <p>$10,000</p>
            <p>Painting</p>
            <p>Oil on canvas</p>
            <p>28 x 36 in</p>
            <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
            <br/><p>${emailSettings?.signature}</p>
          </body>
        </html>
      `)

      expect(getArtworkEmailTemplate({ artwork, fullHtml: true, emailSettings } as any)).toBe(
        expectedHtml
      )
    })

    it("returns a snippet of HTML when fullHtml is false", () => {
      const expectedSnippet = replaceWhitespace(`
        <img
          height="60%"
          src="https://example.com/starry_night.jpg"
        />
        <h1>Vincent van Gogh</h1>
        <p>The Starry Night, 1889</p>
        <p>$10,000</p>
        <p>Painting</p>
        <p>Oil on canvas</p>
        <p>28 x 36 in</p>
        <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
      `)

      expect(getArtworkEmailTemplate({ artwork, fullHtml: false, emailSettings } as any)).toBe(
        expectedSnippet
      )
    })

    describe("omits fields for missing data", () => {
      it("greeting", () => {
        const expectedHtml = replaceWhitespace(`
        <html>
          <body>
            <img
              height="60%"
              src="https://example.com/starry_night.jpg"
            />
            <h1>Vincent van Gogh</h1>
            <p>The Starry Night, 1889</p>
            <p>$10,000</p>
            <p>Painting</p>
            <p>Oil on canvas</p>
            <p>28 x 36 in</p>
            <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
            <br/><p>${emailSettings?.signature}</p>
          </body>
        </html>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork,
            fullHtml: true,
            emailSettings: {
              ...emailSettings,
              greetings: null,
            },
          } as any)
        ).toBe(expectedHtml)
      })

      it("signature", () => {
        const expectedHtml = replaceWhitespace(`
        <html>
          <body>
            <img
              height="60%"
              src="https://example.com/starry_night.jpg"
            />
            <h1>Vincent van Gogh</h1>
            <p>The Starry Night, 1889</p>
            <p>$10,000</p>
            <p>Painting</p>
            <p>Oil on canvas</p>
            <p>28 x 36 in</p>
            <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
          </body>
        </html>
      `)

        expect(
          getArtworkEmailTemplate({
            artwork,
            fullHtml: true,
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
        <h1>Vincent van Gogh</h1>
        <p>The Starry Night, 1889</p>
        <p>$10,000</p>
        <p>Painting</p>
        <p>Oil on canvas</p>
        <p>28 x 36 in</p>
        <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
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
        <img
          height="60%"
          src="https://example.com/starry_night.jpg"
        />
        <h1>Vincent van Gogh</h1>
        <p>1889</p>
        <p>$10,000</p>
        <p>Painting</p>
        <p>Oil on canvas</p>
        <p>28 x 36 in</p>
        <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
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
        <img
          height="60%"
          src="https://example.com/starry_night.jpg"
        />
        <h1>Vincent van Gogh</h1>
        <p>The Starry Night</p>
        <p>$10,000</p>
        <p>Painting</p>
        <p>Oil on canvas</p>
        <p>28 x 36 in</p>
        <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
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
        <img
          height="60%"
          src="https://example.com/starry_night.jpg"
        />
        <p>The Starry Night, 1889</p>
        <p>$10,000</p>
        <p>Painting</p>
        <p>Oil on canvas</p>
        <p>28 x 36 in</p>
        <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
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
        <img
          height="60%"
          src="https://example.com/starry_night.jpg"
        />
        <h1>Vincent van Gogh</h1>
        <p>The Starry Night, 1889</p>
        <p>Painting</p>
        <p>Oil on canvas</p>
        <p>28 x 36 in</p>
        <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
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

      it("mediumType", () => {
        const expectedSnippet = replaceWhitespace(`
        <img
          height="60%"
          src="https://example.com/starry_night.jpg"
        />
        <h1>Vincent van Gogh</h1>
        <p>The Starry Night, 1889</p>
        <p>$10,000</p>
        <p>Oil on canvas</p>
        <p>28 x 36 in</p>
        <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
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
        <img
          height="60%"
          src="https://example.com/starry_night.jpg"
        />
        <h1>Vincent van Gogh</h1>
        <p>The Starry Night, 1889</p>
        <p>$10,000</p>
        <p>Painting</p>
        <p>28 x 36 in</p>
        <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
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
        <img
          height="60%"
          src="https://example.com/starry_night.jpg"
        />
        <h1>Vincent van Gogh</h1>
        <p>The Starry Night, 1889</p>
        <p>$10,000</p>
        <p>Painting</p>
        <p>Oil on canvas</p>
        <a href="https://www.artsy.net/artwork/vincent-van-gogh-the-starry-night">View on Artsy</a>
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
        <img
          height="60%"
          src="https://example.com/starry_night.jpg"
        />
        <h1>Vincent van Gogh</h1>
        <p>The Starry Night, 1889</p>
        <p>$10,000</p>
        <p>Painting</p>
        <p>Oil on canvas</p>
        <p>28 x 36 in</p>
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
    })
  })
})
