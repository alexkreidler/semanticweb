import memdown from "memdown"
import { RdfStore } from "quadstore"
// import SparqlEngine from "quadstore-sparql"
import rdfParser, { RdfParser } from "rdf-parse"
import fs from "fs"
import {
    Backend,
    MessageSub,
    MessagePub,
    ResponseTopic,
    QueriesTopic,
} from "../../api/services"
import { Result, Ok, Err } from "ts-results"

import {
    TSResultType,
    TSRdfQuadStreamResult,
} from "quadstore/dist-cjs/lib/types"
import { Readable } from "stream"
import { Message } from "../../api/messages"

import df from "@rdfjs/data-model"
import { EventEmitter } from "events"
import { toSparql, toSparqlJs } from "sparqlalgebrajs"

const EventEmitter2Promise = (
    ee: EventEmitter,
    task?: string
): Promise<Result<undefined, { err: any }>> => {
    return new Promise((resolve) => {
        ee.on("error", (e) => {
            console.log(`Error ${task ? "while " + task : ""}: ${e}`)
            resolve(Err({ err: e }))
        })
        ee.on("end", () => {
            console.log(`Done ${task ? "with " + task : ""}`)
            resolve(Ok(undefined))
        })
    })
}

export class QuadStore implements Backend {
    name = "node-quadstore"
    queryBroker: MessageSub
    responseBroker: MessagePub

    private store: RdfStore

    /** A list of files to import. Should contain proper file extensions so we can detect the format to use */
    filesToImport: string[]

    async handleMessage(
        d: Message
    ): Promise<Result<undefined, { msg: string }>> {
        console.log("recieved query message", d)

        switch (d.type) {
            case "query":
                console.log("got query")

                const sparql = toSparqlJs(d.op)
                console.log("got sparql", sparql)
                const sparqlText = toSparql(d.op)
                console.log("got sparql", sparqlText)

                // const res = await this.store.sparqlStream(sparqlText)
                // console.log("got sparql result", res)

                // if (res.type == TSResultType.VOID) {
                //     return Err({ msg: "got void result" })
                // } else if (res.type == TSResultType.BINDINGS) {
                //     return Err({ msg: "got binding result, unsupported" })
                // }
                // const iter = (res as TSRdfQuadStreamResult).iterator
                // iter.forEach((quad) => {
                //     this.responseBroker.publish(ResponseTopic, {
                //         requestID: d.requestID,
                //         type: "response",
                //         done: iter.closed,
                //         quad: quad,
                //     })
                // })
                return Ok(undefined)
                // for await (const quad of iter) {

                // }
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

        this.queryBroker.subscribe(QueriesTopic, this.handleMessage)

        if (this.filesToImport !== undefined) {
            let tasks: Promise<Result<undefined, { err: any }>>[] = []
            for (const path of this.filesToImport) {
                console.log(`Importing ${path}`)

                const textStream = fs.createReadStream(path)

                // these types should be linked + exported automatically
                const r: RdfParser = rdfParser
                // Do we want to add logging to this
                const parsedStream = r.parse(textStream, { path })

                const rs = this.store.import(parsedStream)
                tasks.push(EventEmitter2Promise(rs, "importing"))
            }
            // console.log("created tasks", tasks)

            const res = await Promise.all(tasks)
            tasks = undefined
            console.log("results", res)

            return Result.all(...res).map(() => undefined)
        }

        return Ok(undefined)
    }
    async stop(): Promise<Result<undefined, undefined>> {
        // await EventEmitter2Promise(
        //     this.store.deleteGraph(defaultGraph()),
        //     "deleting graph"
        // )
        await this.store.close()
        // For some reason, even if the store variable just exists, it creates a memory leak/makes the app stay running even after a close call
        this.store = undefined
        // this.queryBroker = undefined
        // this.responseBroker = undefined
        return Ok(undefined)
    }
}
