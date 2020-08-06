import { APIFrontend, Backend } from "../api/services"
import { ResultAsync } from "neverthrow"
import bunyan from "bunyan"
import express, { Application } from "express"
// import { TripleSink } from "../api/broker"
import { ulid } from "ulid"

type IRI = string

// TODO: use different names? no
/** The singular name for the resource */
/** The plural name for the resource, used for the collection of all resources of that type */

type Resource = {
    /** The name for the resource. Will be used for creating API endpoints. Should be URL-encoded */
    name: string
    /** The RDF IRI type of the resource. Technically JSON-LD supports multiple types. We don't (simplicity)
     * e.g.
     */
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

const log = bunyan.createLogger({
    name: "semanticweb-server",
    stream: process.stdout,
    level: "debug",
})

import { Result } from "ts-results"
import { MessageType } from "../api/messages"
import { translate } from "sparqlalgebrajs"

class HTTPFrontend implements APIFrontend<HTTPConfig> {
    name: string
    backend: Backend
    configure(config: HTTPConfig): undefined {
        const app = express()

        app.get("/", (req, res) => {
            res.send({
                about:
                    "The mapping key contains a list of all resources provided here. Go to /{name} to acceess all their members",
                mapping: config.mapping,
            })
        })

        for (const resource of config.mapping) {
            log.debug(`Configuring: ${resource.name}`)
            app.get(`/${resource.name}/`, async (req, res) => {
                await this.backend.handleMessage({
                    requestID: ulid(),
                    type: MessageType.Query,
                    op: translate(`
                    SELECT *
                    WHERE {
                        ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ${resource.type} .
                        ?s ?p ?o
                    }`),
                })
                // on response, check that the number of triples from each subject is only one
                // this.tripleSink.write({
                //     requestID: ulid(),
                //     subject: {
                //         match: "ANY",
                //     },
                //     predicate: {
                //         match: "EXACT",
                //         // true exact IRI is http://www.w3.org/1999/02/22-rdf-syntax-ns#type
                //         value: "rdf:type",
                //     },
                //     object: {
                //         match: "EXACT",
                //         value: resource.type,
                //     },
                // })
            })
            app.get(`/${resource.name}/:id`, async (req, res) => {
                await this.backend.handleMessage({
                    requestID: ulid(),
                    type: MessageType.Query,
                    op: translate(`
                    SELECT *
                    WHERE {
                        ${req.params.id} ?p ?o
                    }`),
                })
                // this.tripleSink.write({
                //     requestID: ulid(),
                //     subject: {
                //         match: "EXACT",
                //         value: req.params.id,
                //     },
                //     predicate: {
                //         match: "ANY",
                //     },
                //     object: {
                //         match: "ANY",
                //     },
                // })
            })
        }
        return
    }
    start(): Promise<Result<undefined, Record<string, unknown>>> {
        throw new Error("Method not implemented.")
    }
    stop(): Promise<Result<undefined, Record<string, unknown>>> {
        throw new Error("Method not implemented.")
    }
    // tripleSink: TripleSink = new TripleSink()
    // app: Application = undefined

    // configure(config: HTTPConfig): { ok: true } {

    //     }
    //     return { ok: true }
    // }
    // start(): ResultAsync<{}, {}> {
    //     throw new Error("Method not implemented.")
    // }
    // stop(): ResultAsync<{}, {}> {
    //     throw new Error("Method not implemented.")
    // }
}
