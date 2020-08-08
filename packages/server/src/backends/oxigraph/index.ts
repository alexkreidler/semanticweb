import { Backend, ComponentType } from "../../api/services"
import { Result, Ok, Err } from "ts-results"

import { Message, MessageType } from "../../api/messages"

import { toSparql } from "sparqlalgebrajs"

import superagent from "superagent"
import Logger from "bunyan"

import { SparqlJsonParser } from "sparqljson-parse"

const sparqlJsonParser = new SparqlJsonParser()

export class Oxigraph implements Backend {
    type: ComponentType.Backend = ComponentType.Backend
    log: Logger
    name = "oxigraph"
    host = "0.0.0.0"
    port = 8000

    constructor(host?: string, port?: number) {
        if (host) {
            this.host = host
        }
        if (port) {
            this.port = port
        }
    }

    get baseURL(): string {
        return this.host + ":" + this.port.toString()
    }

    async handleMessage(d: Message): Promise<Result<Message, { msg: string }>> {
        switch (d.type) {
            case MessageType.Query:
                const reqID = d.requestID
                const sparqlText = toSparql(d.op)
                this.log.debug({
                    msg: "parsed sparql text",
                    text: sparqlText,
                    reqID,
                })

                try {
                    const resp = await superagent
                        .post(this.baseURL + "/query")
                        .accept("application/sparql-results+json")
                        // .accept("application/turtle") //"application/n-triples")
                        .set("Content-Type", "application/sparql-query")
                        // .query({ query:  })
                        .send(sparqlText)

                    const sparQLJson = resp.body
                    this.log.debug("recieved json", {
                        json: sparQLJson,
                        reqID,
                    })

                    const rdfBindings = sparqlJsonParser.parseJsonResults(resp.body)

                    this.log.debug("rdf bindings", {
                        rdfBindings,
                    })
                    return Ok({
                        requestID: reqID,
                        type: MessageType.Response,
                        bindings: rdfBindings,
                    } as Message)
                } catch (error) {
                    return Err({ msg: "Request error", error })
                }
                break

            default:
                break
        }
    }
    // In the future, should we start Oxigraph if not already?
    // Likely not, a deployment antipattern
    async start(): Promise<Result<undefined, { err: any }>> {
        return Ok(undefined)
    }
    async stop(): Promise<Result<undefined, any>> {
        // really no cleanup to do here
        return Ok(undefined)
    }
}
