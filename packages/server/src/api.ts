// Use Rust-style explicit error handling
import { ok, err, ResultAsync, Result } from "neverthrow"

type Empty = {}

type IOErrror = {}

type ConfigError = {}

/** API Frontend represents a specific service that will listen to a given API type (e.g. GraphQL or JSON-LD)
 * They accept a standardized configuration format describing
 * 1. The schema of the data types (Internal Schema)
 * 2. Mappings between the Internal Schema to any API-specific data types
 * 3. Other options like request timeouts, etc
 *
 * They are responsible for translating requests from their specific API into a standardized Query format
 */
interface APIFrontend {
    configure(config: any): ConfigError
    start(): ResultAsync<Empty, IOErrror>
    stop(): ResultAsync<Empty, IOErrror>
}

/**
 * The query service is responsible for configuring frontends, starting frontends,
 * and recieving standardized queries from frontends. It then forwards those
 * queries to registered backends.
 */
interface QueryService {
    registerFrontend(f: APIFrontend): Result<Empty, ConfigError>
    startFrontends(): ResultAsync<Empty, IOErrror>
}
