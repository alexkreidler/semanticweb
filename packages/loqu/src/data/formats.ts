import { AnyPointer } from "clownface"

import { Term, Dataset, NamedNode, DatasetCore } from "rdf-js"
import { Options } from "jsonld"
import { FrameMap } from "./frame"
import { RdfResource } from "@tpluscode/rdfine"

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

export type RDFineSpec = {
    format: "rdfine"
}

export type DataSpec = JsonLDToForm | ClownfaceSpec | RdfJSSpec | RDFineSpec

export type D = DataSpec["format"]

export type ClownfaceData = {
    // format: "clownface"
    pointer: AnyPointer
}

/** Virtually every function using an RDF/JS term needs access to the entire dataset to request more data */
export type RDFJSData = {
    // format: "rdf/js"
    node: NamedNode //Term
    dataset: DatasetCore
}

export type RDFJSDataExtended = {
    dataset: DatasetCore
    term: Term
}

export type RDFineData = {
    // format: "rdfine"
    object: RdfResource
}

// type ExtractFrame<F> = F extends FrameSpec<infer T> ? T : any
export type JsonLDData<R extends JsonLDToForm> = {
    // format: "jsonld"
    document: R extends FramedForm<infer T> ? FrameMap<T> : any
}

export type DataFormat = ClownfaceData | RDFJSData | RDFineData

// | R extends JsonLDToForm
//     ? JsonLDData<R>
//     : never
// export type O = OutTypes["format"]

// type ExtractFrame<F> = F extends FrameSpec<infer T> ? T : any
// Would this be better as a discriminated union as well?
export type OutData<R extends DataSpec> = R extends JsonLDToForm
    ? JsonLDData<R>
    : R extends ClownfaceSpec
    ? ClownfaceData
    : R extends RdfJSSpec
    ? RDFJSData
    : R extends RDFineSpec
    ? RDFineData
    : null

export type GetOut<T, A> = T extends { format: A } ? T : never

// export type OutData<TIn extends DataSpec> = TIn extends { format: infer A } ? GetOut<OutTypes, A> : never

// export type OutData<R extends DataSpec> = OutTypes<R>
