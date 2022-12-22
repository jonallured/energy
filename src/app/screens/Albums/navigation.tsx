import { StackNav } from "app/Navigation"
import { AddItemsToAlbum } from "app/screens/Albums/AddItemsToAlbum"
import { AlbumTabs } from "app/screens/Albums/AlbumTabs/AlbumTabs"
import { CreateOrEditAlbum } from "app/screens/Albums/CreateOrEditAlbum/CreateOrEditAlbum"
import { CreateOrEditAlbumChooseArtist } from "app/screens/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtist"
import { CreateOrEditAlbumChooseArtworks } from "app/screens/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtworks"

export type AlbumNavigationScreens = {
  AddItemsToAlbum: {
    artworkIdToAdd?: string
    closeBottomSheetModal?: () => void
  }
  AlbumTabs: { albumId: string }
  CreateOrEditAlbum: {
    mode: "create" | "edit"
    albumId?: string
    artworkIdToAdd?: string
    closeBottomSheetModal?: () => void
  }
  CreateOrEditAlbumChooseArtist: { mode: "create" | "edit"; albumId?: string }
  CreateOrEditAlbumChooseArtworks: { mode: "create" | "edit"; slug: string; albumId?: string }
}

export const AlbumsNavigation = () => {
  return (
    <>
      <StackNav.Screen name="AddItemsToAlbum" component={AddItemsToAlbum} />
      <StackNav.Screen name="AlbumTabs" component={AlbumTabs} />
      <StackNav.Screen name="CreateOrEditAlbum" component={CreateOrEditAlbum} />
      <StackNav.Screen
        name="CreateOrEditAlbumChooseArtist"
        component={CreateOrEditAlbumChooseArtist}
      />
      <StackNav.Screen
        name="CreateOrEditAlbumChooseArtworks"
        component={CreateOrEditAlbumChooseArtworks}
      />
    </>
  )
}
