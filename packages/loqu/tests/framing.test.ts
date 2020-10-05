// Playground

import { parseJSON, prettyPrint } from "../src/utils"

import * as jsonld from "jsonld"

describe("JSON-LD framing tests", () => {
    let person
    beforeAll(async () => {
        const filename = "../../../data/person.jsonld"
        person = await parseJSON(filename)
        expect(person).toBeDefined()
        // console.debug(`Input from file: ${filename}`)

        // console.debug(person)
    })

    test("to flat graph", async () => {
        const framed = await jsonld.frame(person, {})
        console.log(prettyPrint(framed))
        expect(framed).toBeDefined()
    })

    test("to sameish graph", async () => {
        const framed = await jsonld.frame(person, {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "http://example.com/Jane-Doe",
        })
        console.log(prettyPrint(framed))
        expect(framed).toBeDefined()
    })

    test("to explicitly requested graph", async () => {
        const framed = await jsonld.frame(
            person,
            {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "http://example.com/Jane-Doe",
                name: {},
                // With a {} and an embedded node, we only get the node @id, if available,
                // and the type. However, this is when explicit inclusion is true, so its removing
                // non-requested data
                worksFor: {},
            },
            {
                explicit: true,
            }
        )
        console.log(prettyPrint(framed))
        expect(framed).toBeDefined()
    })

    test("with Require-All, true match", async () => {
        const framed = await jsonld.frame(
            person,
            {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "http://example.com/Jane-Doe",
                name: {},
            },
            {
                requireAll: true,
            }
        )
        console.log(prettyPrint(framed))
        expect(framed).toBeDefined()
        expect(framed["name"]).toContain("Doe")
    })

    test("with Require-All, false match", async () => {
        const framed = await jsonld.frame(
            person,
            {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "http://example.com/Jane-Doe",
                name: {},
                // See https://schema.org/dateCreated, this is not present on Person
                dateCreated: {},
            },
            {
                requireAll: true,
            }
        )
        console.log(prettyPrint(framed))
        expect(framed).toBeDefined()
        expect(framed["name"]).toBeUndefined()
        delete framed["@context"]
        expect(framed).toStrictEqual({})
    })

    test("explicit and matching all", async () => {
        const framed = await jsonld.frame(
            person,
            {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "http://example.com/Jane-Doe",
                name: {},
                // With a {} and an embedded node, we only get the node @id, if available,
                // and the type. However, this is when explicit inclusion is true, so its removing
                // non-requested data
                worksFor: {},
            },
            {
                explicit: true,
                requireAll: true,
            }
        )
        console.log(prettyPrint(framed))
        expect(framed).toBeDefined()
    })
})
