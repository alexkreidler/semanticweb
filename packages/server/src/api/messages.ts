import { WritableObjStream, DuplexObjStream } from "./streams"

import { Algebra } from "sparqlalgebrajs"
import { Quad } from "rdf-js"
import { TSRdfBindingArrayResult, TSRdfBinding } from "quadstore/lib/types"
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

export enum MessageType {
    Query,
    Mutation,
    Response,
}

type Query = {
    type: MessageType.Query
    op: Algebra.Operation
}
type Mutation = {
    type: MessageType.Mutation
    op: Algebra.Operation
}
type Response = {
    type: MessageType.Response
    quads?: Quad[]
    bindings?: TSRdfBinding[]
}
type BaseMessage = {
    // Necessary for multiplexing reqs and resps over stream
    requestID: string
}

type RequestMessage = Query | Mutation | Response
export type Message = BaseMessage & RequestMessage
