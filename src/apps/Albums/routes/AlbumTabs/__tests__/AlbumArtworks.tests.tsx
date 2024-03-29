import { useAlbum } from "apps/Albums/hooks/useAlbum"
import { useValidateAlbumItems } from "apps/Albums/hooks/useValidateAlbumItems"
import { AlbumArtworks } from "apps/Albums/routes/AlbumTabs/AlbumArtworks"
import { ArtworkGridItem } from "components/Items/ArtworkGridItem"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { renderWithWrappers } from "utils/test/renderWithWrappers"

jest.mock("apps/Albums/hooks/useAlbum")
jest.mock("apps/Albums/hooks/useValidateAlbumItems")
jest.mock("components/Items/ArtworkGridItem")

describe("AlbumArtworks", () => {
  const albumId = "1"

  const mockUseAlbum = useAlbum as jest.Mock
  const mockUseValidateAlbumItems = useValidateAlbumItems as jest.Mock

  beforeEach(() => {
    mockUseAlbum.mockReturnValue({
      artworks: [
        { internalID: "1", title: "Artwork 1", __typename: "Artwork" },
        { internalID: "2", title: "Artwork 2", __typename: "Artwork" },
        { internalID: "3", title: "Artwork 3", __typename: "Artwork" },
      ] as SelectedItemArtwork[],
    })

    __globalStoreTestUtils__?.injectState({
      auth: {
        activePartnerID: "partner1",
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders a list of artworks", async () => {
    const { UNSAFE_getAllByType } = renderWithWrappers(
      <AlbumArtworks albumId={albumId} />
    )
    expect(UNSAFE_getAllByType(ArtworkGridItem)).toHaveLength(3)
  })

  it("validates the album items on mount", () => {
    renderWithWrappers(<AlbumArtworks albumId={albumId} />)

    expect(mockUseValidateAlbumItems).toHaveBeenCalledWith({
      query: expect.anything(),
      variables: { artworkIDs: ["1", "2", "3"], partnerID: "partner1" },
      idsToValidate: ["1", "2", "3"],
      mapResponseToIDs: expect.anything(),
    })
  })
})
