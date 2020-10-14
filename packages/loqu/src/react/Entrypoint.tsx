import React from "react"
import { RDFJSData } from "../data"

export interface IEntryPointProps {
    data: RDFJSData
    uiContext?: string
    children: React.ReactNode
}

export const Entrypoint = (props: IEntryPointProps) => {
    console.log("At entrypoint")

    return <div></div>
}
