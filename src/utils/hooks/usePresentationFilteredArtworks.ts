import { useMemo } from "react"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"

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

  const filteredArtworks = useMemo(() => {
    if (isNotForSaleHidden && isUnpublishedWorksHidden) {
      return artworks.filter(
        (artwork) => artwork.availability === "for sale" && artwork.published
      )
    } else if (isUnpublishedWorksHidden) {
      return artworks.filter((artwork) => artwork.published)
    } else if (isNotForSaleHidden) {
      return artworks.filter((artwork) => artwork.availability === "for sale")
    } else {
      return artworks
    }
  }, [artworks, isNotForSaleHidden, isUnpublishedWorksHidden])

  return filteredArtworks
}
