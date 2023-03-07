import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItemArtwork } from "app/system/store/Models/SelectModeModel"
import { useMemo } from "react"

export const usePresentationFilteredArtworks = <T extends SelectedItemArtwork>(
  items: Array<T>
): Array<T> => {
  const artworks = items.filter((item) => item.__typename === "Artwork")
  const isUnpublishedWorksHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.unpublishedWorks
  )
  const isNotForSaleHidden = GlobalStore.useAppState(
    (state) => state.presentationMode.hiddenItems.worksNotForSale
  )

  return useMemo(() => {
    if (isNotForSaleHidden && isUnpublishedWorksHidden) {
      return artworks.filter((artwork) => artwork.availability === "for sale" && artwork.published)
    } else if (isUnpublishedWorksHidden) {
      return artworks.filter((artwork) => artwork.published)
    } else if (isNotForSaleHidden) {
      return artworks.filter((artwork) => artwork.availability === "for sale")
    } else {
      return artworks
    }
  }, [artworks, isNotForSaleHidden, isUnpublishedWorksHidden])
}
