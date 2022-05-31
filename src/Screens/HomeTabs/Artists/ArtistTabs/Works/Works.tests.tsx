import { range } from "lodash"
import React from "react"
import { mockEnvironmentPayloadMaybe } from "tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "tests/renderWithWrappers"
import { Works } from "./Works"

describe("Works", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappersTL(<Works slug={"some"} />)
    await mockEnvironmentPayloadMaybe(mockProps)
  })

  it("renders the list of works", async () => {
    const { getByTestId } = renderWithWrappersTL(<Works slug={"some"} />)
    await mockEnvironmentPayloadMaybe(mockProps)
    expect(getByTestId("artist-artwork-list").props.data).toHaveLength(10)
  })
})

const mockProps = {
  Artist: () => ({
    artworksConnection: {
      edges: range(10).map((i) => ({
        node: {
          internalID: `some-id-${i}`,
          title: "Title",
          date: "2022",
          imageURL: "some-url",
        },
      })),
    },
  }),
}
