import React, { useState, useEffect } from "react"

import { ComponentRegistry } from "./registry"

import jsonld from "jsonld"

let reg = new ComponentRegistry()

// type Data = {
//     "@type": string
//     [key: string]: any
// }

// TODO: make data type passed in then map to the @type string
// maybe if we require expanded data to be passed this would work
export type RegistryProps = {
    /** The input data. Should be in (expanded) JSON-LD format */
    data: any
    children: React.ReactNode

    /** For now, we just require it to be expanded beforehand. This doesn't do anything */
    doExpand?: boolean
}

export const Registry: React.FC<RegistryProps> = ({ children, data }) => {
    console.log({ children })
    let [r, setR] = useState(reg)

    // reg.registerCallback = () => {
    //     console.log("callback")

    //     setRend(true)
    // }
    // if (d == undefined) {
    //     return
    // }
    // useEffect(async () => {

    // let expanded = jsonld.expand(data);

    // })

    if (Object.keys(data).length !== 1) {
        return (
            <>
                Error in Semantic Web Registry: Data is not properly formatted
                in expanded format
            </>
        )
    }

    let obj = data[Object.keys(data)[0]]
    let fullTypeIRI = obj["@type"]

    // let res
    let res = r.handle(fullTypeIRI)

    // let res;
    // useEffect(() => {
    // }, [rend])
    // res != undefined &&
    if (!res || res.isErr()) {
        // setRend(true)
        return <>{children}</>
        // return <>Error in Semantic Web Registry: {res.error.message}</>
    } else {
        return <>{res ? res.value : undefined}</>
    }
}

interface MinimalChildProps {
    data: any
}

export type ComponentProps = {
    iri: string
    // children: React.FC<MinimalChildProps>

    children?(props: MinimalChildProps): React.ReactNode
    component?: React.FC<MinimalChildProps>
}
export const Component: React.FC<ComponentProps> = ({
    iri,
    component,
    children,
}) => {
    if (!component && !children) {
        throw new Error("No child component provided")

        // <>No Provided</>
    }
    console.log({ iri })

    if (component) {
        console.debug("using component prop")
        reg.register(iri, component)
    } else if (children) {
        console.debug("using child function")
        reg.register(iri, children)
    }
    return <>THIS SHOULD NOT APPEAR</>
}
