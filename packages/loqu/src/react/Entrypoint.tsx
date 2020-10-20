import React, { useMemo } from "react"
import { useAsync } from "react-async-hook"
import { DataSpec, handleSelectors, RDFJSData, renderSingleComponent, UIContext } from "../data"
import { Registry } from "../registry"
import { dSize } from "../utils"

export interface PropsForComponent {
    [prop: string]: any
}

export interface IEntryPointProps extends PropsForComponent {
    data: RDFJSData
    uiContext?: UIContext
    children?: React.ReactNode
    // [props: string]: any
}

export const Entrypoint: React.FC<IEntryPointProps> = ({ data, uiContext, children, ...props }) => {
    if (children) {
        console.warn("Providing children to the entrypoint component is depracated.")
    }
    console.log("Beginning", props)

    //   data: RDFJSData, uiContext?: UIContext, props?: PropsForComponent
    async function render() {
        console.log("Before render")

        const selected = handleSelectors(Object.values(Registry.map), data, { uiContext })
        console.log("Chose component:", selected[0].id)

        return await renderSingleComponent(selected[0], data, props)
    }

    // The issue with multiple renders was with the props argument to the function, because that is passed as deps to an internal useEffect call.
    // Since props was passed as an empty object that is checked by reference, it thinks its different. Also props gets passed multiple times
    const state = useAsync(render, [])
    //   const state = useRegistry(data, uiContext, props)

    switch (state.status) {
        case "error":
            // throw state.error
            return <>Error: {state.error?.message}</>
        // console.error(state.error)

        case "loading":
            return <>Loading</>

        case "success":
            return <>{state.result}</>

        case "not-requested":
            return <>Unknown</>

        default:
            return <>Unknown</>
    }
}
