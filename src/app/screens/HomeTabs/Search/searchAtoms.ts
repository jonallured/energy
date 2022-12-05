import { atom } from "jotai"
import { PillType } from "./SearchPills"

export const selectedPillAtom = atom<PillType | null>(null)

export const disabledPillsAtom = atom<PillType[]>([])
