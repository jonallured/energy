import { useAlbum } from "apps/Albums/hooks/useAlbum"
import { AlbumInstalls } from "apps/Albums/routes/AlbumTabs/AlbumInstalls"
import { ArtworkImageGridItem } from "components/Items/ArtworkImageGridItem"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { SelectedItemInstall } from "system/store/Models/SelectModeModel"
import { renderWithWrappers } from "utils/test/renderWithWrappers"

jest.mock("apps/Albums/hooks/useAlbum")
jest.mock("apps/Albums/hooks/useValidateAlbumItems")
jest.mock("components/Items/ArtworkImageGridItem")

describe("AlbumInstalls", () => {
  const albumId = "1"

  const mockUseAlbum = useAlbum as jest.Mock

  beforeEach(() => {
    mockUseAlbum.mockReturnValue({
      installs: [
        { internalID: "1", url: "Artwork 1", __typename: "Image" },
        { internalID: "2", url: "Artwork 2", __typename: "Image" },
        { internalID: "3", url: "Artwork 3", __typename: "Image" },
      ] as SelectedItemInstall[],
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

  it("renders a list of installs", async () => {
    const { UNSAFE_getAllByType } = renderWithWrappers(
      <AlbumInstalls albumId={albumId} />
    )

    expect(UNSAFE_getAllByType(ArtworkImageGridItem)).toHaveLength(3)
  })
})
