// Playground

import { parseJSON, prettyPrint } from "./utils"

import { createSemanticFunction, runSingleFunc } from "./index"

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
        console.log("basic single func")

        const sf = createSemanticFunction(
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
            (data: any) => {
                console.log("Got data")
                console.log(data)
                let n = data.name as string
                return n.includes("Jane")
            }
        )

        const output = await runSingleFunc(sf, person)
        console.log("final output:", output)
    })
})
