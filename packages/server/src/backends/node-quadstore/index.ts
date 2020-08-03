import memdown from "memdown"
import quadstore from "quadstore"
import SparqlEngine from "quadstore-sparql"
import rdfParser, { RdfParser } from "rdf-parse"
import fs from "fs"
import { Backend } from "../../api/services"
import { LOADIPHLPAPI } from "dns"

export class QuadStore implements Backend {
    private store: quadstore.RdfStore
    initialize() {
        const opts = {
            dataFactory: require("@rdfjs/data-model"),
        }
        this.store = new quadstore.RdfStore(memdown(), opts)
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

        rs.on("error", console.log)
        rs.on("end", () => {
            console.log(rs)

            // rs.unpipe()
        })
        rs.pause()

        return
    }
    cleanup() {
        // this.store.end
    }
}
