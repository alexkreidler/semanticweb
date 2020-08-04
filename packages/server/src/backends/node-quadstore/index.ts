import memdown from "memdown"
import { RdfStore } from "quadstore"
import SparqlEngine from "quadstore-sparql"
import rdfParser, { RdfParser } from "rdf-parse"
import fs from "fs"
import { Backend } from "../../api/services"
import { ResultAsync, okAsync } from "neverthrow"

export class QuadStore implements Backend {
    name = "node-quadstore"
    private store: RdfStore
    start(): ResultAsync<{}, {}> {
        const opts = {
            backend: memdown(),
            dataFactory: require("@rdfjs/data-model"),
        }
        this.store = new RdfStore(opts)
        // const sparqlEngineInstance = new SparqlEngine(store)

        const path = "./data/person.jsonld"
        const textStream = fs.createReadStream(path)

        // these types should be linked + exported automatically
        const r: RdfParser = rdfParser
        // Do we want to add logging to this
        const parsedStream = r.parse(textStream, { path })

        let rs = this.store.import(parsedStream)

        // setTimeout(async () => {
        //     console.log("in timeout, done")

        //     await this.store.close()
        // }, 1000)

        return okAsync({})
    }
    stop(): ResultAsync<{}, {}> {
        const run = async () => {
            await this.store.close()
            return {}
        }
        return ResultAsync.fromPromise(run(), (e) => ({ msg: e }))
    }
}
