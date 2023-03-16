import React, { useEffect, createContext, useState } from "react"

interface PortalContextProps {
  portalChildren: React.ReactNode | null
  setPortalChildren: (children: this["portalChildren"]) => void
}

export const PortalContext = createContext<PortalContextProps>({
  setPortalChildren: null,
  portalChildren: null,
} as unknown as PortalContextProps)

export const PortalProvider: React.FC = ({ children }) => {
  const [portalChildren, setPortalChildren] = useState<PortalContextProps["portalChildren"]>(null)

  const contextProps = {
    setPortalChildren,
    portalChildren,
  }

  return (
    <PortalContext.Provider value={contextProps}>
      {portalChildren}
      {children}
    </PortalContext.Provider>
  )
}

interface PortalProps {
  active: boolean
}

export const Portal: React.FC<PortalProps> = ({ children, active }) => {
  const { setPortalChildren } = React.useContext(PortalContext)

  useEffect(() => {
    if (active) {
      setPortalChildren(children)
    }
  }, [children, setPortalChildren])

  return null
}
