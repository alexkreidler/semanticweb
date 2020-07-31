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
export type RegistryProps = { data: any; children: React.ReactNode }
export const Registry: React.FC<RegistryProps> = ({ children, data }) => {
    console.log({ children })
    let [d, setData] = useState(undefined)

    // useEffect(async () => {

    // let expanded = jsonld.expand(data);

    // })

    if (d == undefined) {
        return
    }

    let res = reg.handle(data["@type"])
    if (res.isErr()) {
        return <>Error in Semantic Web Registry: {res.error.message}</>
    }
    return <>{res.value}</>
}

export type ComponentProps = { iri: string; children: React.ReactNode }
export const Component: React.FC<ComponentProps> = ({ iri, children }) => {
    console.log({ iri })
    reg.register(iri, children)
    return <>THIS SHOULD NOT APPEAR</>
}
