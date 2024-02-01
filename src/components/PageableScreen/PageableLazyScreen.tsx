import { ScrollableScreenEntity } from "components/PageableScreen/PageableScreensContext"
import { useEffect, useState } from "react"
import styled from "styled-components/native"

interface PageableLazyScreenProps {
  screen: ScrollableScreenEntity
  shouldRender: boolean
}

export const PageableLazyScreen: React.FC<PageableLazyScreenProps> = ({
  screen,
  shouldRender,
}) => {
  const [canMount, setCanMount] = useState(false)

  useEffect(() => {
    if (shouldRender) {
      setCanMount(true)
    }
  }, [shouldRender])

  if (canMount) {
    return (
      <Container>
        <screen.Component />
      </Container>
    )
  }

  return <Container pointerEvents="box-none" />
}

const Container = styled.View`
  width: 100%;
  height: 100%;
`
