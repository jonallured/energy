import { DocumentGridItem } from "components/Items/DocumentGridItem"
import { AlbumDocuments } from "screens/Albums/AlbumTabs/AlbumDocuments"
import { useAlbum } from "screens/Albums/useAlbum"
import { useValidateAlbumItems } from "screens/Albums/useValidateAlbumItems"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { SelectedItemDocument } from "system/store/Models/SelectModeModel"
import { renderWithWrappers } from "utils/test/renderWithWrappers"

jest.mock("screens/Albums/useAlbum")
jest.mock("screens/Albums/useValidateAlbumItems")
jest.mock("components/Items/DocumentGridItem")

describe("AlbumDocuments", () => {
  const albumId = "1"

  const mockUseAlbum = useAlbum as jest.Mock
  const mockUseValidateAlbumItems = useValidateAlbumItems as jest.Mock

  beforeEach(() => {
    mockUseAlbum.mockReturnValue({
      documents: [
        { internalID: "1", title: "Document 1", __typename: "PartnerDocument" },
        { internalID: "2", title: "Document 2", __typename: "PartnerDocument" },
        { internalID: "3", title: "Document 3", __typename: "PartnerDocument" },
      ] as SelectedItemDocument[],
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

  it("renders a list of documents", async () => {
    const { UNSAFE_getAllByType } = renderWithWrappers(
      <AlbumDocuments albumId={albumId} />
    )
    expect(UNSAFE_getAllByType(DocumentGridItem)).toHaveLength(3)
  })

  it("validates the album items on mount", () => {
    renderWithWrappers(<AlbumDocuments albumId={albumId} />)

    expect(mockUseValidateAlbumItems).toHaveBeenCalledWith({
      query: expect.anything(),
      variables: { documentIDs: ["1", "2", "3"], partnerID: "partner1" },
      idsToValidate: ["1", "2", "3"],
      mapResponseToIDs: expect.anything(),
    })
  })
})
