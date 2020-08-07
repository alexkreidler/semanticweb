import { Backend, ComponentType } from "../../api/services"
import { Result, Ok, Err } from "ts-results"

import { Message, MessageType } from "../../api/messages"

import { toSparql, toSparqlJs } from "sparqlalgebrajs"

import superagent from "superagent"
import Logger from "bunyan"

export class Oxigraph implements Backend {
    type: ComponentType.Backend
    log: Logger
    name = "oxigraph"
    host = "0.0.0.0"
    port = 9000

    constructor(host?: string, port?: number) {
        if (host) {
            this.host = host
        }
        if (port) {
            this.port = port
        }
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

                const resp = await superagent
                    .post(this.host + this.port.toString() + "/query")
                    .send(sparqlText)
                const sparQLJson = resp.body
                this.log.debug({
                    msg: "recieved json",
                    json: sparQLJson,
                    reqID,
                })

                return undefined
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
