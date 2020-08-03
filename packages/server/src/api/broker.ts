import { WritableObjStream } from "./streams"

import { Algebra } from "sparqlalgebrajs"
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
type BaseMessage = {
    // Necessary for multiplexing reqs and resps over stream
    requestID: string
}

type RequestMessage = Query | Mutation
type Message = BaseMessage & RequestMessage

// export type TripleSink = WritableObjStream<Message>

// class TripleSinkC extends WritableObjStream<Message> {}

// // Creates theh singleton triple
// export const TripleSink = new TripleSinkC()
