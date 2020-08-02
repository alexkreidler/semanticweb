// Use Rust-style explicit error handling
import { ok, err, ResultAsync, Result } from "neverthrow"
import { Writable } from "stream"

type Empty = {}

type IOErrror = {}

type ConfigError = {}

type Query = {}
type Mutation = {}
type BaseMessage = {
    // Necessary for multiplexing reqs and resps over stream
    requestID: string
}

type Message = (Query | Mutation) & BaseMessage

/** API Frontend represents a specific service that will listen to a given API type (e.g. GraphQL or JSON-LD)
 * They accept a standardized configuration format describing
 * 1. The schema of the data types (Internal Schema)
 * 2. Mappings between the Internal Schema to any API-specific data types
 * 3. Other options like request timeouts, etc
 *
 * They are responsible for translating requests from their specific API into a standardized Query format
 */
export interface APIFrontend<C> {
    configure(config: C): ConfigError
    start(): ResultAsync<Empty, IOErrror>
    stop(): ResultAsync<Empty, IOErrror>

    /** This is expected to be set by the user of the API Frontend before any data arrives. It may be set after calling configure */
    /**
     *  TODO: use cases
     * - JSON-LD to RDF streaming - yes, benefit to node Streams
     * - JSON-LD fetch one node - not much benefit, also needs to return result
     */
    tripleSink: TripleSink
}

/**
 * The query service is responsible for configuring frontends, starting frontends,
 * and recieving standardized queries from frontends. It then forwards those
 * queries to registered backends.
 */
export interface QueryService {
    registerFrontend<C>(f: APIFrontend<C>): Result<Empty, ConfigError>
    startFrontends(): ResultAsync<Empty, IOErrror>
}
