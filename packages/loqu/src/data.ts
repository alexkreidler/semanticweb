import { JsonLd } from "./jsonld-types"

import { AnyPointer } from "clownface"

import { Term, Quad, Source, Dataset } from "rdf-js"
import { Conversion, Strictness } from "./index"
import { Options } from "jsonld"

// export type JsonLDForm = "expanded" | "flattened" | "compacted" | "framed"

// export type JsonLDSpec = {
//     format: "jsonld"
//     form: JsonLDForm
// }

/** Determines when a semantic component or processor should be applies */
export type Selector = IRISelector | FunctionSelector | MatchSelector

/** MatchSelector calls Dataset.match(matchArgs) based on the given backing dataset. It returns true if any quads are emitted, false otherwise.
 * Is there a real use-case for this?
 */
export type MatchSelector = {
    matchArgs: Parameters<Source["match"]>
}

/** This matches if the potential node's IRI is the same, or matches a regex
 */
export type IRISelector = {
    iri: string | RegExp
}

/** This executes a function to determine if the component matches the node */
export type FunctionSelector = {
    // what type should data be: a clownface pointer? an rdf/js namednode, with another parameter for the dataset?
    enabled: (data: any) => boolean
}

// export type SFunc<F, T> = (data: FrameMap<F>) => T
/** Do we want to make this generic over return types? */
export type SemanticComponent<R extends DataSpec> = {
    selector: Selector
    /** Options to control the preprocessing of the input data */
    data: {
        strictness: Strictness
        conversion?: Conversion
        spec: R
        // TODO: allow other transformations, e.g. expand, compact, before passing data
        // frame?: {
        //     spec: F
        //     opts?: Options.Frame
        // }
    }
    /** The component or element to render */
    component: ({
        data,
    }: {
        data: R extends { format: "jsonld"; form: "framed" } ? R & { data: FrameMap<R["frame"]> } : R
    }) => React.ReactNode
}

const sc = {
    hey: "yherte",
}

const ds: DataSpec<typeof sc> = {
    format: "jsonld",
    form: "framed",
    frame: {
        spec: sc,
    },
}
export const GL: SemanticComponent<typeof ds> = {
    selector: {
        iri: /.*/,
    },
    data: {
        strictness: Strictness.NoChecks,
        spec: ds,
    },

    component: ({ data }) => {
        data.data.
        // data.data
        // data.data
        // data.data
        // data.data
        // data.form.
        return "hey"
    },
}

// export type JsonLDData<F, D extends JsonLDToForm = JsonLDToForm<F>> = D & {
//     data: D["form"] extends "framed" ? FrameMap<F> : any
// }

export type FrameSpec<F> = { spec: F; opts?: Options.Frame }
export type JsonLDToForm<F = {}, C = {}> =
    | {
          format: "jsonld"
          form: "compacted"
          context: JsonLd
      }
    | { format: "jsonld"; form: "framed"; frame: FrameSpec<F> }
    | { format: "jsonld"; form: "expanded" }
    | { format: "jsonld"; form: "flattened" }

export type ClownfaceSpec = {
    format: "clownface"
}
export type RdfJSSpec = {
    format: "rdf/js"
}

export type DataSpec<F = {}, C = {}> = JsonLDToForm<F, C> | ClownfaceSpec | RdfJSSpec

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

// export enum JsonLDForm {
//     Expanded,
//     Compacted,
//     Flattened,
//     Framed,
// }

type ExtractFrame<F> = F extends FrameSpec<infer T> ? T : any

/** FrameMap maps an input frame to a strongly typed output of the frame result. We preserve the type of context as is */
export type FrameMap<F extends FrameSpec<T>, T = ExtractFrame<F>> = {
    [K in keyof T]: K extends "@context"
        ? T[K]
        : T[K] extends object
        ? any // this handles all @embed options (e.g. a string ID vs an object)
        : T[K] extends string
        ? string
        : T[K] extends object[] // This doesn't work yet
        ? any[]
        : unknown
}

const sp = {
    hey: "there"
}
const fs: FrameSpec<typeof sp> = { spec: sp
}

const out: FrameMap<typeof fs>

out.hey
// type JLDForm = "expanded" | "flattened" | { form: "compacted"; context: JsonLd } | { form: "framed"; frame: JsonLd }

// Does extends JsonLd matter?
// export type ToForm<F = {}, R = JsonLDForm> = { format: "jsonld"; form: R } & (R extends "framed"
//     ? { frame: F }
//     : R extends "compacted"
//     ? { context: JsonLd }
//     : {})

// const toExpand: ToForm = {
//     format: "jsonld",
//     form: "expanded",
// }

// const fm: ToForm = {
//     format: "jsonld",
//     form: "framed",
//     frame
// }
