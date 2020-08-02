import { WritableObjStream } from "./streams"

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
    subject: Match
    predicate: Match
    object: Match
}
type Mutation = {
    update: boolean
}
type BaseMessage = {
    // Necessary for multiplexing reqs and resps over stream
    requestID: string
}

type MT = Query | Mutation
type Message = BaseMessage & MT

// export type TripleSink = WritableObjStream<Message>

export class TripleSink extends WritableObjStream<Message> {}
