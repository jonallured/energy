import { action, Action } from "easy-peasy"

export interface EmailModel {
  ccRecipients: string
  greetings: string
  signature: string
  oneArtworkSubject: string
  multipleArtworksAndArtistsSubject: string
  multipleArtworksBySameArtistSubject: string

  setCCRecipients: Action<this, string>
  setGreetings: Action<this, string>
  setSignature: Action<this, string>
  setOneArtworkSubject: Action<this, string>
  setMultipleArtworksAndArtistsSubject: Action<this, string>
  setMultipleArtworksBySameArtistSubject: Action<this, string>
}

export const getEmailModel = (): EmailModel => ({
  ccRecipients: "",
  greetings: "Here is more information about the artwork(s) we discussed.",
  signature: "",
  oneArtworkSubject: "More information about $title by $artist.",
  multipleArtworksAndArtistsSubject: "More information about the artworks we discussed.",
  multipleArtworksBySameArtistSubject: "More information about $artist's artworks.",

  setCCRecipients: action((state, value) => {
    state.ccRecipients = value
  }),

  setGreetings: action((state, value) => {
    state.greetings = value
  }),

  setSignature: action((state, value) => {
    state.signature = value
  }),

  setOneArtworkSubject: action((state, value) => {
    state.oneArtworkSubject = value
  }),

  setMultipleArtworksAndArtistsSubject: action((state, value) => {
    state.multipleArtworksAndArtistsSubject = value
  }),

  setMultipleArtworksBySameArtistSubject: action((state, value) => {
    state.multipleArtworksBySameArtistSubject = value
  }),
})
