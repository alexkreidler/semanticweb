import { AnyPointer } from "clownface"

import { Term, Dataset } from "rdf-js"
import { Options } from "jsonld"
import { FrameMap } from "./frame"

// type ExtractFrame<F> = F extends FrameSpec<infer T> ? T : any
export type JsonLDData<R extends JsonLDToForm> = R & {
    data: R extends FramedForm<infer T> ? FrameMap<T> : any
}

// export type FrameSpec<F> = { spec: F; opts?: Options.Frame }
export type JsonLDToForm<F = {}, C = {}> =
    | {
          format: "jsonld"
          form: "compacted"
          context: C // JsonLd
      }
    | FramedForm<F>
    | { format: "jsonld"; form: "expanded" }
    | { format: "jsonld"; form: "flattened" }

export type FramedForm<F> = { format: "jsonld"; form: "framed"; frameSpec: F; frameOpts?: Options.Frame }

export type ClownfaceSpec = {
    format: "clownface"
}
export type RdfJSSpec = {
    format: "rdf/js"
}

export type DataSpec = JsonLDToForm | ClownfaceSpec | RdfJSSpec

export type ClownfaceData<S extends ClownfaceSpec> = {
    format: "clownface"
    pointer: AnyPointer
}

/** Virtually every function using an RDF/JS term needs access to the entire dataset to request more data */
export type RDFJSData<S extends RdfJSSpec> = {
    format: "rdf/js"
    node: Term
    dataset: Dataset
}

// type ExtractFrame<F> = F extends FrameSpec<infer T> ? T : any
