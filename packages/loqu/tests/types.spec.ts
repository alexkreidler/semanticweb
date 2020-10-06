import { parseJSON, prettyPrint } from "../src/utils"

import * as jsonld from "jsonld"

import { frameWithChecks, Strictness } from "../src/index"

describe("types", () => {
    let person
    beforeAll(async () => {
        const filename = "../../../data/person.jsonld"
        person = await parseJSON(filename)
        expect(person).toBeDefined()
        // console.debug(`Input from file: ${filename}`)

        // console.debug(person)
    })

    const baseFrame = {
        "@context": [
            "https://schema.org",
            {
                worksFor: { "@id": "http://schema.org/worksFor", "@container": "@set" },
                id: null,
                type: null,
            },
        ],
        "@type": "Person",
        "@id": "http://example.com/Jane-Doe",
        address: {},
        worksFor: [{}],
        sameAs: {},
        email: "",
    }

    test("basic", async () => {
        const framed = await frameWithChecks(person, baseFrame, Strictness.FrameStrict)
        expect(framed).toBeDefined()
    })

    test("basic undefined result", async () => {
        const framed = await frameWithChecks(person, { ...baseFrame, brand: "" }, Strictness.FrameStrict)
        expect(framed).toBeUndefined()
    })
})
