import { createContext } from "react"

export interface ILoquController {}

export const WindowContext = createContext<ILoquController>({})
