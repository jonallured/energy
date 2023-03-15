import { StackNav } from "Navigation"
import { Suspense } from "react"
import { AddItemsToAlbum } from "screens/Albums/AddItemsToAlbum"
import { AlbumTabs } from "screens/Albums/AlbumTabs/AlbumTabs"
import { CreateOrEditAlbum } from "screens/Albums/CreateOrEditAlbum/CreateOrEditAlbum"
import { CreateOrEditAlbumChooseArtist } from "screens/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtist"
import { CreateOrEditAlbumChooseArtworks } from "screens/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtworks"
import { SelectedItem } from "system/store/Models/SelectModeModel"
import { SuspenseWrapper } from "system/wrappers/SuspenseWrapper"

export type AlbumNavigationScreens = {
  AddItemsToAlbum: {
    artworkToAdd?: SelectedItem
    artworksToAdd?: SelectedItem[]
    closeBottomSheetModal?: () => void
  }
  AlbumTabs: { albumId: string }
  CreateOrEditAlbum: {
    mode: "create" | "edit"
    albumId?: string
    artworkToAdd?: SelectedItem
    artworksToAdd?: SelectedItem[]
    closeBottomSheetModal?: () => void
  }
  CreateOrEditAlbumChooseArtist: {
    mode: "create" | "edit"
    albumId?: string
  }
  CreateOrEditAlbumChooseArtworks: {
    mode: "create" | "edit"
    albumId?: string
    slug: string
  }
}

export const AlbumsNavigation = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="AddItemsToAlbum" component={AddItemsToAlbum} />
      <StackNav.Screen name="AlbumTabs" component={AlbumTabs} />
      <StackNav.Screen name="CreateOrEditAlbum" component={CreateOrEditAlbum} />
      <StackNav.Screen
        name="CreateOrEditAlbumChooseArtist"
        children={() => {
          return (
            <SuspenseWrapper>
              <CreateOrEditAlbumChooseArtist />
            </SuspenseWrapper>
          )
        }}
      />
      <StackNav.Screen
        name="CreateOrEditAlbumChooseArtworks"
        children={() => {
          return (
            <SuspenseWrapper>
              <CreateOrEditAlbumChooseArtworks />
            </SuspenseWrapper>
          )
        }}
      />
    </StackNav.Group>
  )
}
