import { APIFrontend, Backend, ComponentType } from "../api/services"

import { JsonLdSerializer } from "jsonld-streaming-serializer"
import express, { Application } from "express"
import { ulid } from "ulid"

import { Quad } from "rdf-js"

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

import { Result, Ok, Err } from "ts-results"
import { MessageType, Response } from "../api/messages"
import { translate } from "sparqlalgebrajs"
import { Server } from "net"

import { prefixes as defaultPrefixes } from "@zazuko/rdf-vocabularies"
import Logger from "bunyan"
import { TSRdfBinding } from "quadstore/dist-cjs/lib/types"
import { quad, defaultGraph, namedNode } from "@rdfjs/data-model"

export class HTTPFrontend implements APIFrontend<HTTPConfig> {
    type: ComponentType.Frontend = ComponentType.Frontend
    log: Logger
    name = "http"
    backend: Backend
    app: Application
    port = 9000
    hostname = "0.0.0.0"
    server: Server

    constructor(config: HTTPConfig, logger: Logger) {
        this.log = logger
        this.configure(config)
    }

    configure(config: HTTPConfig): undefined {
        this.app = express()
        if (config.options) {
            config.options.hostname ? (this.hostname = config.options.hostname) : null
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
            this.log.debug(`Configuring: ${resource.name}`)
            this.app.get(`/${resource.name}/`, async (req, res) => {
                try {
                    const query = translate(
                        `
                    SELECT *
                    WHERE {
                        ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ${resource.type} .
                        # ?s ?p ?o
                    }`,
                        { prefixes }
                    )
                    const result = await this.backend.handleMessage({
                        requestID: ulid(),
                        type: MessageType.Query,
                        op: query,
                    })
                    if (!result) {
                        res.json({ error: "No result" })
                        return
                    }
                    if (result.err) {
                        this.log.error(`Error in backend: ${result.val}`)
                        res.status(500).json({ error: result.val })
                    } else {
                        // TODO: maybe don't return the metadata like requestID. Can an attacker gain knowledge about the system based on ULIDs?
                        const out = result.val as {
                            bindings: TSRdfBinding[]
                        }

                        let final
                        if (out.bindings) {
                            final = out.bindings.map((b) => {
                                let id
                                if (b.s) {
                                    id = b.s.value
                                } else if (b.subj) {
                                    id = b.subj.value
                                }
                                return {
                                    "@id": id,
                                    link: encodeURIComponent(id),
                                }
                            })
                        }

                        res.json({ ...out, bindings: final })
                    }
                } catch (error) {
                    this.log.error(`Unhandled error: ${error}`)
                    res.status(500).json({ error: error.toString() })
                }
            })
            this.app.get(`/${resource.name}/:id`, async (req, res) => {
                try {
                    const id = req.params.id
                    const iri = id.startsWith("_:") ? id : `<${id}>`
                    const query = translate(
                        `
                SELECT *
                WHERE {
                    ${iri} ?p ?o
                }`,
                        { prefixes }
                    )
                    const result = await this.backend.handleMessage({
                        requestID: ulid(),
                        type: MessageType.Query,
                        op: query,
                    })
                    if (!result) {
                        res.json({ error: "No result" })
                        return
                    }
                    if (result.err) {
                        this.log.error(`Error in backend: ${result.val}`)
                        res.status(500).json({ error: result.val })
                        return
                    }
                    type TBinding = {
                        results: { bindings: TSRdfBinding[] }
                    }
                    const message = (result.val as unknown) as Response

                    // const out = message.response

                    const mySerializer = new JsonLdSerializer({ space: "  " })

                    mySerializer.pipe(res)

                    if (message.bindings) {
                        message.bindings.forEach((b) => {
                            let id
                            // keep in mind the predicate is already known
                            if (b.p && b.o) {
                                // if (!(b.s.termType == "NamedNode" || b.s.termType == "BlankNode")) {
                                //     return
                                // }
                                if (b.p.termType != "NamedNode") {
                                    return
                                }

                                if (
                                    !(
                                        b.o.termType == "NamedNode" ||
                                        b.o.termType == "BlankNode" ||
                                        b.o.termType == "Literal"
                                    )
                                ) {
                                    return
                                }
                                const q = quad(namedNode(req.params.id), b.p, b.o, defaultGraph())
                                this.log.debug({ quad: q })
                                mySerializer.write(q)
                            }
                        })
                    }
                    mySerializer.end()
                    res.status(200).contentType("json")
                } catch (error) {
                    this.log.error(`Unhandled error: ${error}`)
                    res.status(500).json({ error: error.toString() })
                }
            })
        }
        return
    }
    async start(listenCallback?: () => void): Promise<Result<undefined, Record<string, unknown>>> {
        if (!this.app) {
            return Err({
                msg: "Failed to start, no app found. This means you haven't called configure()",
            })
        }
        this.server = this.app.listen(this.port, this.hostname, listenCallback)
        return Ok(undefined)
    }
    async stop(): Promise<Result<undefined, Record<string, unknown>>> {
        if (!this.server) {
            return Err({
                msg: "Failed to stop, no server found. This means you haven't started the frontend",
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
}
