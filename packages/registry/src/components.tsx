import React, { useState, useEffect, useContext, createContext } from "react"

import { ComponentRegistry } from "./registry"

import jsonld, { JsonLdProcessor } from "jsonld"

// type Data = {
//     "@type": string
//     [key: string]: any
// }

// TODO: make data type passed in then map to the @type string
// maybe if we require expanded data to be passed this would work
export type RegistryProps = {
    /** The input data. Should be in (expanded) JSON-LD format */
    data: any
    children: React.ReactElement<ComponentProps>[]

    /** For now, we just require it to be expanded beforehand. This doesn't do anything */
    doExpand?: boolean
}

let ctx = createContext({ __SEMANTIC_REGISTRY_EMPTY: true })

export const Registry: React.FC<RegistryProps> = ({
    children,
    data,
    doExpand,
}) => {
    console.log({ children })

    let reg = new ComponentRegistry<MinimalChildProps>()
    let c = useContext(ctx)

    let [loading, setLoading] = useState(true)

    let [edata, setEData] = useState(undefined)

    let [fdata, setFData] = useState(undefined)

    let rdat = undefined
    if (doExpand && !edata) {
        console.log("Expand mode enabled, expanding")

        jsonld
            .expand(data, {})
            .then((v) => {
                console.log("Done expanding, got", v)

                setEData(v)
                // setLoading(false)
            })
            .catch((e) => console.error(e))
    } else if (edata) {
        rdat = edata
    } else if (!doExpand) {
        console.log("Expand flag off, using sent data")

        rdat = data
    }

    //@ts-ignore
    const nodeDocumentLoader = jsonld.documentLoaders.node()

    //@ts-ignore
    jsonld.documentLoader = nodeDocumentLoader
    if (rdat) {
        let obj = rdat[Object.keys(rdat)[0]]
        // we only take the first defined type.
        // TODO: fix??
        let fullTypeIRI = obj["@type"][0]

        React.Children.map(children, (c) => {
            if (!c.props.children && !c.props.component) {
                throw new Error(
                    "Provided <Component> doesn't specify a child component to render"
                )
            } else if (c.props.children && c.props.component) {
                throw new Error(
                    "Provided <Component> specifies two child components"
                )
            } else {
                let child = c.props.component
                    ? c.props.component
                    : c.props.children
                reg.register(c.props.iri, child)
            }
        })

        // let res
        let res = reg.handle(fullTypeIRI)

        if (res.isErr()) {
            return <>Error in Semantic Web Registry: {res.error.message}</>
            // return <>Error in Semantic Web Registry: {res.error.message}</>
        } else {
            let Final = res.value
            if (!data) {
                throw new Error("wat!")
            }
            // NOTE: the typescript definitions for this function allow 1 arg, but the runtime needs 2
            if (!fdata) {
                jsonld
                    .compact(data, {})
                    .then((v) => {
                        console.log("Done compacting, got", v)

                        setFData(v)
                        setLoading(false)
                    })
                    .catch((e) => console.error(e))
            }
            // TODO: rearchitect to allow passing props from container to component
            return loading ? <>Loading</> : <Final data={fdata}></Final>
        }
    }
    return <>Loading</>
}

interface MinimalChildProps {
    data: any
}

export type ComponentProps = {
    iri: string
    // children: React.FC<MinimalChildProps>

    children?: React.FC<MinimalChildProps> //(props: MinimalChildProps): React.ReactNode
    component?: React.FC<MinimalChildProps>
    [x: string]: any
}
export const Component: React.FC<ComponentProps> = () => {
    return <>THIS SHOULD NOT APPEAR</>
}
