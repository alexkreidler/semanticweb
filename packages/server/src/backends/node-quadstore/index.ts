import memdown from "memdown"
import { RdfStore } from "quadstore"
// import SparqlEngine from "quadstore-sparql"
import rdfParser, { RdfParser } from "rdf-parse"
import fs from "fs"
import { Backend, ComponentType } from "../../api/services"
import { Result, Ok, Err } from "ts-results"

import { Message, MessageType } from "../../api/messages"

import df from "@rdfjs/data-model"
import { EventEmitter } from "events"
import { toSparql } from "sparqlalgebrajs"
import { TSRdfQuadArrayResult, TSResultType } from "quadstore/dist/cjs/lib/types"
import Logger from "bunyan"

const EventEmitter2Promise = (ee: EventEmitter): Promise<Result<undefined, { err: any }>> => {
    return new Promise((resolve) => {
        ee.on("error", (e) => {
            resolve(Err({ err: e }))
        })
        ee.on("end", () => {
            resolve(Ok(undefined))
        })
    })
}

export class QuadStore implements Backend {
    type: ComponentType.Backend = ComponentType.Backend
    log: Logger

    name = "node-quadstore"

    private store: RdfStore

    /** A list of files to import. Should contain proper file extensions so we can detect the format to use */
    filesToImport: string[]

    async handleMessage(d: Message): Promise<Result<Message, { msg: string }>> {
        switch (d.type) {
            case MessageType.Query:
                const sparqlText = toSparql(d.op)

                const res = await this.store.sparql(sparqlText)

                if (res.type == TSResultType.VOID) {
                    return Err({ msg: "got void result" })
                } else if (res.type == TSResultType.BINDINGS) {
                    const ret: Message = {
                        requestID: d.requestID,
                        bindings: res.items,
                        type: MessageType.Response,
                    }
                    return Ok(ret)
                }
                const arr = (res as TSRdfQuadArrayResult).items
                const ret: Message = {
                    requestID: d.requestID,
                    quads: arr,
                    type: MessageType.Response,
                }
                return Ok(ret)
                break

            default:
                break
        }
    }
    async start(): Promise<Result<undefined, { err: any }>> {
        const opts = {
            backend: memdown(),
            dataFactory: df,
        }
        this.store = new RdfStore(opts)
        // const sparqlEngineInstance = new SparqlEngine(store)

        if (this.filesToImport !== undefined) {
            this.log.info({
                msg: "automatically importing",
                files: this.filesToImport,
            })
            let tasks: Promise<Result<undefined, { err: any }>>[] = []
            for (const path of this.filesToImport) {
                const textStream = fs.createReadStream(path)

                // these types should be linked + exported automatically
                const r: RdfParser = rdfParser
                // Do we want to add logging to this
                const parsedStream = r.parse(textStream, { path })

                const rs = this.store.import(parsedStream)
                tasks.push(EventEmitter2Promise(rs))
            }

            const res = await Promise.all(tasks)
            tasks = undefined

            return Result.all(...res).map(() => undefined)
        }

        return Ok(undefined)
    }
    async stop(): Promise<Result<undefined, any>> {
        try {
            await this.store.close()
        } catch (err) {
            return Err({ msg: "Failed to close store", err })
        }
        // For some reason, even if the store variable just exists, it creates a memory leak/makes the app stay running even after a close call
        this.store = undefined
        return Ok(undefined)
    }
}
