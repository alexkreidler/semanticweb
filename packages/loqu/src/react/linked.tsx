import React from "react"
import { DataSpec, renderSingleComponent, SemanticComponent } from "../data"
import { Registry } from "../registry"
import { IEntryPointProps } from "./Entrypoint"

export function linked<R extends DataSpec, P = {}>(
    comp: SemanticComponent<R, P>
): React.ComponentType<IEntryPointProps> {
    // console.log("linking, registering")

    // Registry.register(comp)
    // const x = ({ data, ...props }) => <>{renderSingleComponent(comp, data, props)}</>
    return () => <>Hey there</>
}
