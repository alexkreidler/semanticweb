// Playground

import { parseJSON, prettyPrint } from "../src/utils"

import { createSemanticFunction, runSingleFunc } from "../src/index"

describe("semantic functions", () => {
    let person
    beforeAll(async () => {
        const filename = "../../../data/person.jsonld"
        person = await parseJSON(filename)
        expect(person).toBeDefined()
        // console.debug(`Input from file: ${filename}`)

        // console.debug(person)
    })

    test("basic single function run", async () => {
        const sf = createSemanticFunction(
            {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "http://example.com/Jane-Doe",
                name: "",
                // With a {} and an embedded node, we only get the node @id, if available,
                // and the type. However, this is when explicit inclusion is true, so its removing
                // non-requested data
                worksFor: {},
            },
            (data) => {
                return data.name.includes("Jane")
            }
        )

        const output = await runSingleFunc(sf, person)
        expect(output).toBe(true)
    })
})
