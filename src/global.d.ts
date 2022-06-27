import "jest-extended"

declare global {
  const __TEST__: boolean
}

type DeepPartial<T extends object> = Partial<{
  [k in keyof T]: T[k] extends object ? DeepPartial<T[k]> : T[k]
}>
