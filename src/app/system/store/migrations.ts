import { GlobalStoreModel } from "app/system/store/Models/GlobalStoreModel"
import { Store } from "easy-peasy"

/**
 * IMPORTANT
 * Before you modify this file please read
 * https://github.com/artsy/eigen/blob/main/docs/adding_state_migrations.md
 */

export const Versions = {
  AddActivePartnerId: 1,
  MigrateActivePartnerIdToAuthModel: 2,
  MigrateRefactoredSelectModeStore: 3,
  MigrateEmailModelCCName: 4,
}

export const CURRENT_APP_VERSION = Versions.MigrateEmailModelCCName

export type Migrations = Record<number, (oldState: any) => any>

export const energyAppMigrations: Migrations = {
  [Versions.AddActivePartnerId]: (state) => {
    state.activePartnerId = ""
  },
  [Versions.MigrateActivePartnerIdToAuthModel]: (state) => {
    state.auth.activePartnerId = ""
    delete state.activePartnerId
  },
  [Versions.MigrateRefactoredSelectModeStore]: (state) => {
    delete state.sessionState

    state.albums = {
      albums: state.albums.albums?.map((album: any) => {
        const artworks =
          album.artworkIds?.map((slug: string) => ({
            __typename: "Artwork",
            internalID: slug,
            slug,
          })) ?? []
        const documents =
          album.documentIds?.map((slug: string) => ({
            __typename: "Document",
            internalID: slug,
            slug,
          })) ?? []
        const installShots =
          album.installShotUrls?.map((url: string) => ({
            __typename: "Image",
            internalID: null,
            resized: {
              height: null,
              url,
            },
          })) ?? []

        const migratedAlbum = {
          createdAt: album?.createdAt,
          id: album?.id,
          name: album?.name,
          items: [...artworks, ...documents, ...installShots],
        }

        return migratedAlbum
      }),
    }
  },
  [Versions.MigrateEmailModelCCName]: (state) => {
    state.email.ccRecipients = state.email.emailsCC
    delete state.email.emailsCC
  },
}

export function performMigrations(store: Store<GlobalStoreModel>) {
  store.persist.resolveRehydration().then(() => {
    store.getActions().performMigrations()
  })
}
