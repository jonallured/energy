import { getChildrenByTypeDeep } from "react-nanny"

const Content = ({ children }: { children?: React.ReactNode }) => <>{children}</>

interface WrapProps {
  if: boolean
  children?: React.ReactNode
}

const WrapRoot = ({ if: condition, children }: WrapProps) => {
  if (condition) return <>{children}</>

  const wrapContentChildren = getChildrenByTypeDeep(children, Content)
  if (wrapContentChildren.length === 0) {
    throw new Error("Wrap.Content is required")
  }
  if (wrapContentChildren.length > 1) {
    throw new Error("You can't have more than one Wrap.Content")
  }

  const actualWrapContent = wrapContentChildren[0]
  return <>{actualWrapContent}</>
}

export const Wrap = Object.assign(WrapRoot, { Content })
