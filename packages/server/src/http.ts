import { APIFrontend } from "./api"
import { ResultAsync } from "neverthrow"

type IRI = string

type Resource = {
    /** The singular name for the resource */
    name: string
    /** The plural name for the resource, used for the collection of all resources of that type */
    collection: string
    /** The Linked Data type of the resource. Technically JSON-LD supports multiple types. We don't (simplicity) */
    type: IRI
}

type HTTPConfig = {
    /** The mapping represents the minimal information needed to map JSON-LD nodes to HTTP endpoints */
    mapping: Resource[]

    options: {
        /** This allows for requests to mutate data to not provide appropriate @context and @type information.
         * It assumes that the provided requests exactly conform to the mapping data types, unless other options (e.g. mutationMode: flexible are set)
         * This is not recommended, as it likely indicates clients are not smart/json-ld clients.
         * Additionally, it's not difficult to add one field (@type) the clients that mutate data
         * */
        supportNonLD: boolean

        /** If enabled, this uses the rubensworks/jsonld-streaming-parser.js library, compliant with the
         * [JSON-LD 1.1 Streaming Specification](https://w3c.github.io/json-ld-streaming/). This may allow
         * handling large files without running out of memory. Currently, this is only supported for
         * JSON-LD to RDF, not the other way around. Thus it only works on Mutations,
         * not to improve performance of Queries
         *
         * By default, the server will send batches of the generated RDF triples to the Broker in chunks (see `tripleBufferSize`)
         */
        streaming: boolean

        /**
         * This integer specifies the number of RDF triples to buffer before sending. It defaults to 100 (TODO: tests)
         *
         * In the future, we may support other methods to reduce network congestion between this server and the database
         */
        tripleBufferSize: number

        // TODO timeout, etc
    }
}

class HTTPFrontend implements APIFrontend<HTTPConfig> {
    configure(config: HTTPConfig): {} {
        throw new Error("Method not implemented.")
    }
    start(): ResultAsync<{}, {}> {
        throw new Error("Method not implemented.")
    }
    stop(): ResultAsync<{}, {}> {
        throw new Error("Method not implemented.")
    }
}
