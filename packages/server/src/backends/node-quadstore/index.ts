import memdown from "memdown"
import { RdfStore } from "quadstore"
import SparqlEngine from "quadstore-sparql"
import rdfParser, { RdfParser } from "rdf-parse"
import fs from "fs"
import { Backend } from "../../api/services"

export class QuadStore implements Backend {
    private store: RdfStore
    initialize() {
        const opts = {
            backend: memdown(),
            dataFactory: require("@rdfjs/data-model"),
        }
        this.store = new RdfStore(opts)
        // const sparqlEngineInstance = new SparqlEngine(store)

        const path = "./data/person.jsonld"
        const textStream = fs.createReadStream(path)
        console.log(this.store)

        // these types should be linked + exported automatically
        const r: RdfParser = rdfParser
        // Do we want to add logging to this
        const parsedStream = r.parse(textStream, { path })

        let rs = this.store.import(parsedStream)
        console.log(rs)

        return
    }
    cleanup() {
        // this.store.end
    }
}
