// Use Rust-style explicit error handling
import { ok, err, ResultAsync, Result } from "neverthrow"
// import { Writable } from "stream"
// import { TripleSink } from "./broker"

type Empty = {}

type IOErrror = {}

type ConfigError = {}

interface CommonComponent {
    start(): ResultAsync<{}, {}>
    stop(): ResultAsync<{}, {}>
}

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
    // tripleSink: TripleSink
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
}
