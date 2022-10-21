import { useMemo } from "react"
import { FragmentRefs } from "relay-runtime"
import { GlobalStore } from "app/store/GlobalStore"

export interface PresentedArtworkProps {
  readonly internalID: string
  readonly slug: string
  readonly published: boolean
  readonly availability: string | null
  readonly " $fragmentRefs": FragmentRefs<"ArtworkGridItem_artwork">
}

export const usePresentationFilteredArtworks = (
  artworks: Array<PresentedArtworkProps>
): Array<PresentedArtworkProps> => {
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
