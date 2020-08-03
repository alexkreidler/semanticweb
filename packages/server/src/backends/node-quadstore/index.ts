import memdown from "memdown"
import quadstore from "quadstore"
import SparqlEngine from "quadstore-sparql"
import rdfParser, { RdfParser } from "rdf-parse"
import fs from "fs"
import { Backend } from "../../api/services"

export class QuadStore implements Backend {
    initialize() {
        // const store = new quadstore.RdfStore(memdown())
        // const sparqlEngineInstance = new SparqlEngine(store)

        const path = "./data/person.jsonld"
        const textStream = fs.createReadStream(path)

        // these types should be linked + exported automatically
        const r: RdfParser = rdfParser
        r.parse(textStream, { path })
            .on("data", (quad) => console.log(quad))
            .on("error", (error) => console.error(error))
            .on("end", () => console.log("All done!"))

        // store.import()
    }
}
