import { StackNav } from "app/Navigation"
import { AddItemsToAlbum } from "app/screens/Albums/AddItemsToAlbum"
import { AlbumTabs } from "app/screens/Albums/AlbumTabs/AlbumTabs"
import { CreateOrEditAlbum } from "app/screens/Albums/CreateOrEditAlbum/CreateOrEditAlbum"
import { CreateOrEditAlbumChooseArtist } from "app/screens/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtist"
import { CreateOrEditAlbumChooseArtworks } from "app/screens/Albums/CreateOrEditAlbum/CreateOrEditAlbumChooseArtworks"
import { SelectedItem } from "app/system/store/Models/SelectModeModel"

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
        component={CreateOrEditAlbumChooseArtist}
      />
      <StackNav.Screen
        name="CreateOrEditAlbumChooseArtworks"
        component={CreateOrEditAlbumChooseArtworks}
      />
    </StackNav.Group>
  )
}
