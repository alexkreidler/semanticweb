// Use Rust-style explicit error handling
import { Ok, Err, Result } from "ts-results"
import { Pub, Sub } from "./pubsub"
import { Message } from "./messages"
// import { Writable } from "stream"
// import { TripleSink } from "./broker"
export type AResult<T, E> = Promise<Result<T, E>>

type Empty = {}

type IOErrror = {}

type ConfigError = {}

interface CommonComponent {
    start(): AResult<{}, {}>
    stop(): AResult<{}, {}>
}

export type MessagePub = Pub<Message, void>
export type MessageSub = Sub<Message, void>

export const QueriesTopic = "queries"
export const ResponseTopic = "responses"

/** API Frontend represents a specific service that will listen to a given API type (e.g. GraphQL or JSON-LD)
 * They accept a standardized configuration format describing
 * 1. The schema of the data types (Internal Schema)
 * 2. Mappings between the Internal Schema to any API-specific data types
 * 3. Other options like request timeouts, etc
 *
 * They are responsible for translating requests from their specific API into a standardized Query format
 */
export interface APIFrontend<C> extends CommonComponent {
    name: string
    configure(config: C): ConfigError

    /** This is expected to be set by the user of the API Frontend before any data arrives. It may be set after calling configure */
    /**
     *  TODO: use cases
     * - JSON-LD to RDF streaming - yes, benefit to node Streams
     * - JSON-LD fetch one node - not much benefit, also needs to return result
     */
    /** The Query Broker is used to send Queries (and Mutations) to the Backend(s) */
    queryBroker: MessagePub

    /**The Response broker is used by the Primary Backend to send canonical Responses to the frontend */
    responseBroker: MessageSub
}

/**
 * The query service is responsible for configuring frontends, starting frontends,
 * and recieving standardized queries from frontends. It then forwards those
 * queries to registered backends.
 */
export interface DynamicServer extends CommonComponent {
    registerFrontend<C>(f: APIFrontend<C>): Result<Empty, ConfigError>
    registerBackend(b: Backend): Result<Empty, ConfigError>

    // Start and stop starts frontends and backends
}

// We may want to implement rdf-js Store
export interface Backend extends CommonComponent {
    name: string
    queryBroker: MessageSub
    responseBroker: MessagePub
}
