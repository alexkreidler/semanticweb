import { WritableObjStream, DuplexObjStream } from "./streams"

import { Algebra } from "sparqlalgebrajs"
import { Quad } from "rdf-js"
// type Matcher = string | "ANY"

type Any = {
    match: "ANY"
}

type Exact = {
    match: "EXACT"
    value: string
}

// Normalizes IRIs by expanding prefixes, optionally converting HTTP(S)
type IRI = {
    match: "IRI"
    value: string
}

// TODO: add prefix?
type Match = Any | Exact

type Query = {
    type: "query"
    op: Algebra.Operation
}
type Mutation = {
    type: "mutation"
    op: Algebra.Operation
}
type Response = {
    type: "response"
    quad: Quad
    /** After the frontend recieves done, it should end its streaming serialization and sent the result */
    done: boolean
}
type BaseMessage = {
    // Necessary for multiplexing reqs and resps over stream
    requestID: string
}

type RequestMessage = Query | Mutation | Response
export type Message = BaseMessage & RequestMessage
