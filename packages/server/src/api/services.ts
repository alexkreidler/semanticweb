// Use Rust-style explicit error handling
import { Result } from "ts-results"
import { Message } from "./messages"

export type AResult<T, E> = Promise<Result<T, E>>

type Empty = undefined

type ConfigError = undefined

type Error = Record<string, unknown>

/** The CommonComponent exposes an interface for starting and stopping built-in Node components
 * that utilize I/O resources (like a server listener or database file)
 * It shouldn't be used to start or stop external components, rather may check for their availability and return an error.
 * However, where possibly, it shouldn't error and wait for a real request to be made before erroring
 */
interface CommonComponent {
    start(): Promise<Result<undefined, Error>>
    stop(): Promise<Result<undefined, Error>>
}

// export type MessagePub = Pub<Message, void>
// export type MessageSub = Sub<Message, void>

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

    // Each API frontend only can have one backend
    backend: Backend
}

/**
 * The query service is responsible for configuring frontends, starting frontends,
 * and recieving standardized queries from frontends. It then forwards those
 * queries to registered backends.
 */
export interface DynamicServer extends CommonComponent {
    registerFrontend<C>(f: APIFrontend<C>): Result<Empty, ConfigError>
    registerBackend(
        frontendName: string,
        b: Backend
    ): Result<Empty, ConfigError>

    // Start and stop starts frontends and backends
}

// We may want to implement rdf-js Store
export interface Backend extends CommonComponent {
    name: string
    handleMessage(d: Message): Promise<Result<Message, { msg: string }>>
}
