import { RdfDereferencer } from "rdf-dereference"

import rDeref from "rdf-dereference"

import { storeStream } from "rdf-store-stream"
import { DataFactory } from "rdf-data-factory"

import { parseJSON, prettyPrint, stream2String } from "./utils"

import * as jsonld from "jsonld"

import { Quad } from "rdf-js"

// import * as RdfString from "rdf-string"

import rdfSerializer from "rdf-serialize"

// console.log(RdfString)

describe("Dereference tests", () => {
    let person
    beforeAll(async () => {
        const filename = "../../../data/person.jsonld"
        person = await parseJSON(filename)
        expect(person).toBeDefined()
    })
    test("prior", async () => {
        console.log(await rdfSerializer.getContentTypesPrioritized())
    })

    test("hey", async () => {
        // const rDeref = new RdfDereferencer({})
        const rDDeref = rDeref as RdfDereferencer
        const { quads } = await rDDeref.dereference("https://schema.org/Person")
        // const dataFactory = new DataFactory()

        const textStream = rdfSerializer.serialize(quads, { contentType: "application/ld+json" }) //"application/n-quads" })

        // Handle the serialization in the streaming manner
        // const comp = new Promise<string>((resolve, reject) => {
        //     textStream.pipe(process.stdout)

        //     textStream.on("error", (error) => reject(error)).on("end", () => resolve("All done!"))
        // })
        // const out = await comp
        // console.log(out)

        const out = await stream2String(textStream)
        console.log(out)

        // const store = await storeStream(quads)
        // let re = /.*/
        // const out = store.match(re, re, re, re)

        // Now you can do quad pattern queries over the stream, such as getting all triples having 'http://example.org/subject' as subject.
        // const resultStream = store.match(dataFactory.namedNode("http://example.org/subject"))
    })
})
