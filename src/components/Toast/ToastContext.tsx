import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo,
} from "react"
import { Animated } from "react-native"
import { Toast, ToastItem } from "./Toast"

interface ToastContextProps {
  show: (options: ToastItem) => void
  hide: () => void
}

const SHOW_ANIMATION_VELOCITY = 450
const HIDE_ANIMATION_VELOCITY = 400
const REPLACE_ANIMATION_VELOCITY = 350

export const ToastContext = React.createContext<ToastContextProps>({
  show: () => {},
  hide: () => {},
})

export const ToastProvider: React.FC = ({ children }) => {
  const [toast, setToast] = useState<ToastItem | null>(null)
  const showingToast = useRef<boolean>(false)
  const lastStartedAt = useRef<number | null>(null)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const [opacityAnim] = useState(new Animated.Value(0))
  const [translateYAnim] = useState(new Animated.Value(0))

  const runAnimation = useCallback((mode: "show" | "hide") => {
    const nextAnimationValue = mode === "show" ? 1 : 0
    const animationDuration =
      mode === "show" ? SHOW_ANIMATION_VELOCITY : HIDE_ANIMATION_VELOCITY

    return new Promise((resolve) => {
      if (__TEST__) {
        return resolve(null)
      }

      Animated.parallel([
        Animated.spring(translateYAnim, {
          toValue: nextAnimationValue,
          useNativeDriver: true,
          friction: 55,
        }),
        Animated.timing(opacityAnim, {
          toValue: nextAnimationValue,
          useNativeDriver: true,
          duration: animationDuration,
        }),
      ]).start(resolve)
    })
  }, [])

  const clearStartedTimeout = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const hide: ToastContextProps["hide"] = useCallback(async () => {
    await runAnimation("hide")
    setToast(null)
    clearStartedTimeout()
    showingToast.current = false
  }, [setToast])

  const show: ToastContextProps["show"] = useCallback(
    async (options) => {
      const { autoHide = true, hideTimeout = 2000 } = options
      const now = Date.now()
      lastStartedAt.current = now

      clearStartedTimeout()

      if (showingToast.current) {
        runAnimation("hide")
        await delay(REPLACE_ANIMATION_VELOCITY)
      }

      // Check race condition
      if (lastStartedAt.current === now) {
        setToast(options)
        showingToast.current = true

        if (autoHide) {
          timer.current = setTimeout(hide, hideTimeout)
        }

        lastStartedAt.current = null
      }
    },
    [clearStartedTimeout, hide, setToast]
  )

  useEffect(() => {
    if (toast) {
      runAnimation("show")
    }
  }, [toast])

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      {!!toast && (
        <Toast
          {...toast}
          opacityAnimation={opacityAnim}
          translateYAnimation={translateYAnim}
        />
      )}
    </ToastContext.Provider>
  )
}

export const delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))

export const useToast = () => {
  const contextValue = useContext(ToastContext)

  const toast = useMemo(
    () => ({
      show: contextValue.show,
      hide: contextValue.hide,
    }),
    [contextValue]
  )

  return {
    toast,
  }
}
