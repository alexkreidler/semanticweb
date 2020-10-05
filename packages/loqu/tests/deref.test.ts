import { RdfDereferencer } from "rdf-dereference"

import rDeref from "rdf-dereference"

// import { storeStream } from "rdf-store-stream"
// import { DataFactory } from "rdf-data-factory"

import { parseJSON, prettyPrint, stream2String } from "../src/utils"

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
    test("priorities", async () => {
        console.log(await rdfSerializer.getContentTypesPrioritized())
    })

    test("deref, flatten, frame to specific props", async () => {
        // const rDeref = new RdfDereferencer({})
        const rDDeref = rDeref as RdfDereferencer
        const { quads } = await rDDeref.dereference("https://schema.org/Person")
        // const dataFactory = new DataFactory()

        const textStream = rdfSerializer.serialize(quads, { contentType: "application/ld+json" }) //"application/n-quads" })

        const out = await stream2String(textStream)

        const obj = JSON.parse(out)
        const flat = await jsonld.flatten(obj, {})
        console.log(prettyPrint(flat))

        const framed = await jsonld.frame(
            flat,
            {
                "@context": {
                    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
                },
                "@id": ["http://schema.org/worksFor", "http://schema.org/vatID"],
                "rdfs:label": {},
                "rdfs:comment": {},
            },
            {
                explicit: true,
            }
        )
        console.log(prettyPrint(framed))

        // const compacted = await jsonld.compact(framed, {})
        // console.log(prettyPrint(compacted))
    })
})
