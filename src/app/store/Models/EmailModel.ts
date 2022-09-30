import { action, Action } from "easy-peasy"

export interface EmailModel {
  emailsCC: string
  greetings: string
  signature: string
  oneArtworkSubject: string
  multipleArtworksAndArtistsSubject: string
  multipleArtworksBySameArtistSubject: string

  saveEmailsCC: Action<this, string>
  saveGreetings: Action<this, string>
  saveSignature: Action<this, string>
  saveOneArtworkSubject: Action<this, string>
  saveMultipleArtworksAndArtistsSubject: Action<this, string>
  saveMultipleArtworksBySameArtistSubject: Action<this, string>
}

export const getEmailModel = (): EmailModel => ({
  emailsCC: "",
  greetings: "Here is more information about the artwork(s) we discussed.",
  signature: "",
  oneArtworkSubject: "More information about $title by $artist.",
  multipleArtworksAndArtistsSubject: "More information about the artworks we discussed.",
  multipleArtworksBySameArtistSubject: "More information about $artist's artworks.",
  saveEmailsCC: action((state, value) => {
    state.emailsCC = value
  }),
  saveGreetings: action((state, value) => {
    state.greetings = value
  }),
  saveSignature: action((state, value) => {
    state.signature = value
  }),
  saveOneArtworkSubject: action((state, value) => {
    state.oneArtworkSubject = value
  }),
  saveMultipleArtworksAndArtistsSubject: action((state, value) => {
    state.multipleArtworksAndArtistsSubject = value
  }),
  saveMultipleArtworksBySameArtistSubject: action((state, value) => {
    state.multipleArtworksBySameArtistSubject = value
  }),
})
