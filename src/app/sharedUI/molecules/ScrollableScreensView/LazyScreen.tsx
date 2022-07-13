import { useEffect, useRef, useState } from "react"
import styled from "styled-components/native"
import { ScrollableScreenEntity } from "./types"

interface ScrollableLazyScreenProps {
  screen: ScrollableScreenEntity
  shouldRender: boolean
}

// TODO: Remove this component when we need to request data for all artworks
export const ScrollableLazyScreen: React.FC<ScrollableLazyScreenProps> = ({
  screen,
  shouldRender,
}) => {
  // If `canMount` is true, then we should render screen contents. Otherwise, a stub is displayed.
  const [canMount, setCanMount] = useState(false)

  useEffect(() => {
    if (shouldRender) {
      setCanMount(true)
    }
  }, [shouldRender])

  if (canMount) {
    return <Container>{screen.content}</Container>
  }

  return <Container pointerEvents="box-none" />
}

const Container = styled.View`
  width: 100%;
  height: 100%;
`
