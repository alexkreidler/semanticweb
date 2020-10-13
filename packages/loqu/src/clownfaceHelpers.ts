import { AnyPointer } from "clownface"
import { Term } from "rdf-js"
import { RDFJSDataExtended } from "./data/formats"

export const clownface2RDF = (pointer: AnyPointer) => {
    const out: RDFJSDataExtended[] = (pointer.terms as Term[]).map((t) => {
        return {
            dataset: pointer.dataset,
            term: t,
        }
    })
    return out
}
