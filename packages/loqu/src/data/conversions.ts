import { RdfResource } from "@tpluscode/rdfine"
import clownface from "clownface"
import { NamedNode } from "rdf-js"
import { ClownfaceData, RDFineData, RDFJSData } from "./formats"

export function RDFine2RDFJS(res: RdfResource): RDFJSData {
    // @types/rdf-js version incompatibilities
    //@ts-ignore
    return { dataset: res.pointer.dataset, node: res.id as NamedNode }
}

export function RDFineData2RDFJS(res: RDFineData): RDFJSData {
    return RDFine2RDFJS(res.object)
}

export function RDFJS2Clownface(data: RDFJSData): ClownfaceData {
    //@ts-ignore
    return { pointer: clownface({ dataset: data.dataset }).namedNode(data.node) }
}

export function Clownface2RDFJS(data: ClownfaceData): RDFJSData {
    if (data.pointer.terms.length !== 1) {
        throw new Error("Clownface pointer must only point to one node")
    }
    if (data.pointer.terms[0].termType !== "NamedNode") {
        throw new Error("The pointer must be to a named node")
    }
    // @ts-ignore
    return { dataset: data.pointer.dataset, node: data.pointer.terms[0] }
}
