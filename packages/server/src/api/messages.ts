import { Algebra } from "sparqlalgebrajs"
import { Quad } from "rdf-js"
import { TSRdfBinding } from "quadstore/dist-cjs/lib/types"

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

export type Query = {
    type: MessageType.Query
    op: Algebra.Operation
}
export type Mutation = {
    type: MessageType.Mutation
    op: Algebra.Operation
}
export type Response = {
    type: MessageType.Response
    quads?: Quad[]
    bindings?: TSRdfBinding[]
}
export type BaseMessage = {
    // Necessary for multiplexing reqs and resps over stream
    requestID: string
}

type RequestMessage = Query | Mutation | Response
export type Message = BaseMessage & RequestMessage
