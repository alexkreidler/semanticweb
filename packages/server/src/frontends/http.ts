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

    prefixes?: { [prefix: string]: string }
    options?: {
        // We'll only add options as needed and implemented
        port?: number
        hostname?: string
    }
}

const log = bunyan.createLogger({
    name: "semanticweb-server",
    stream: process.stdout,
    level: "debug",
    version: "0.1.0",
})

import { Result, Ok, Err } from "ts-results"
import { MessageType } from "../api/messages"
import { translate } from "sparqlalgebrajs"
import { Http2SecureServer } from "http2"
import { Server } from "net"

import { prefixes as defaultPrefixes } from "@zazuko/rdf-vocabularies"

export class HTTPFrontend implements APIFrontend<HTTPConfig> {
    name: string
    backend: Backend
    app: Application
    port = 9000
    hostname = "0.0.0.0"
    server: Server
    configure(config: HTTPConfig): undefined {
        this.app = express()
        if (config.options) {
            config.options.hostname
                ? (this.hostname = config.options.hostname)
                : null
            config.options.port ? (this.port = config.options.port) : null
        }
        const prefixes = config.prefixes ? config.prefixes : defaultPrefixes

        this.app.get("/", (req, res) => {
            res.send({
                about:
                    "The mapping key contains a list of all resources provided here. Go to /{name} to acceess all their members",
                mapping: config.mapping,
            })
        })

        for (const resource of config.mapping) {
            log.debug(`Configuring: ${resource.name}`)
            this.app.get(`/${resource.name}/`, async (req, res) => {
                try {
                    const query = translate(
                        `
                    SELECT *
                    WHERE {
                        ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ${resource.type} .
                        ?s ?p ?o
                    }`,
                        { prefixes }
                    )
                    const result = await this.backend.handleMessage({
                        requestID: ulid(),
                        type: MessageType.Query,
                        op: query,
                    })
                    if (!result) {
                        res.json({})
                        return
                    }
                    if (result.err) {
                        log.error(`Error in backend: ${result.val}`)
                        res.status(500).json({ error: result.val })
                    } else {
                        res.json(result.val)
                    }
                } catch (error) {
                    log.error(`Unhandled error: ${error}`)
                    res.status(500).json({ error: error.toString() })
                }
            })
            this.app.get(`/${resource.name}/:id`, async (req, res) => {
                await this.backend.handleMessage({
                    requestID: ulid(),
                    type: MessageType.Query,
                    op: translate(
                        `
                    SELECT *
                    WHERE {
                        ${req.params.id} ?p ?o
                    }`,
                        { prefixes }
                    ),
                })
            })
        }
        return
    }
    async start(
        listenCallback?: () => void
    ): Promise<Result<undefined, Record<string, unknown>>> {
        if (!this.app) {
            return Err({
                msg:
                    "Failed to start, no app found. This means you haven't called configure()",
            })
        }
        this.server = this.app.listen(this.port, this.hostname, listenCallback)
        return Ok(undefined)
    }
    async stop(): Promise<Result<undefined, Record<string, unknown>>> {
        if (!this.server) {
            return Err({
                msg:
                    "Failed to stop, no server found. This means you haven't started the frontend",
            })
        }
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    resolve(Err({ err: err }))
                }
                resolve(undefined)
            })
        })
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
