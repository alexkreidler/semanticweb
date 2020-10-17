import { RdfResource } from "@tpluscode/rdfine"
import { NamedNode } from "rdf-js"
import { RDFineData, RDFJSData } from "./formats"

export function RDFine2RDFJS(res: RdfResource): RDFJSData {
    // @types/rdf-js version incompatibilities
    //@ts-ignore
    return { dataset: res.pointer.dataset, node: res.id as NamedNode }
}

export function RDFineData2RDFJS(res: RDFineData): RDFJSData {
    return RDFine2RDFJS(res.object)
}
