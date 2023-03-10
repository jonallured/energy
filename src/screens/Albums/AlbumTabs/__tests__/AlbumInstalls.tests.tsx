import { ArtworkImageGridItem } from "components/Items/ArtworkImageGridItem"
import { AlbumInstalls } from "screens/Albums/AlbumTabs/AlbumInstalls"
import { useAlbum } from "screens/Albums/useAlbum"
import { useValidateAlbumItems } from "screens/Albums/useValidateAlbumItems"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { SelectedItemInstall } from "system/store/Models/SelectModeModel"
import { renderWithWrappers } from "utils/test/renderWithWrappers"

jest.mock("screens/Albums/useAlbum")
jest.mock("screens/Albums/useValidateAlbumItems")
jest.mock("components/Items/ArtworkImageGridItem")

describe("AlbumInstalls", () => {
  const albumId = "1"

  const mockUseAlbum = useAlbum as jest.Mock
  const mockUseValidateAlbumItems = useValidateAlbumItems as jest.Mock

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
    jest.resetAllMocks()
  })

  it("renders a list of installs", async () => {
    const { UNSAFE_getAllByType } = renderWithWrappers(<AlbumInstalls albumId={albumId} />)
    expect(UNSAFE_getAllByType(ArtworkImageGridItem)).toHaveLength(3)
  })

  it("validates the album items on mount", () => {
    renderWithWrappers(<AlbumInstalls albumId={albumId} />)

    expect(mockUseValidateAlbumItems).toHaveBeenCalledWith({
      query: expect.anything(),
      variables: { partnerID: "partner1" },
      idsToValidate: ["1", "2", "3"],
      mapResponseToIDs: expect.anything(),
    })
  })
})
