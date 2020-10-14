import React from "react"
import { DataSpec, handleSelectors, RDFJSData, renderSingleComponent, UIContext } from "../data"
import { Registry } from "../registry"

interface PropsForComponent {
    [prop: string]: any
}

export interface IEntryPointProps extends PropsForComponent {
    data: RDFJSData
    uiContext?: UIContext
    children?: React.ReactNode
    // [props: string]: any
}

export const Entrypoint = ({ data, uiContext, children, ...props }: IEntryPointProps) => {
    // console.log("At entrypoint")
    if (children) {
        console.warn("Providing children to the entrypoint component is depracated.")
    }

    const selected = handleSelectors(Object.values(Registry.map), data, { uiContext })
    if (selected.length > 2) {
        console.warn(`More than 2 selectors for data item ${data.node.value}`)
    }
    // console.log(selected)
    if (!selected[0]) {
        return <>Unfortunately, we failed to find a registered component that matched your provided data.</>
    }

    const out = renderSingleComponent(selected[0], data, props)

    return <>{out}</>
}
