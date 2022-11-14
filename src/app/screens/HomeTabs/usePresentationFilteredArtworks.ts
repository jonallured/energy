import { useMemo } from "react"
import { GlobalStore } from "app/store/GlobalStore"

interface PresentedArtworkProps {
  readonly internalID: string
  readonly slug: string
  readonly published: boolean
  readonly availability: string | null
}

export const usePresentationFilteredArtworks = <T extends PresentedArtworkProps>(
  artworks: Array<T>
): Array<T> => {
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
