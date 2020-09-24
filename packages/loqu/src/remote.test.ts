import { parseJSON, prettyPrint } from "./utils"

import * as jsonld from "jsonld"
import { propertyTypeLookup } from "./validation"

describe("data fetching", () => {
    let person
    beforeAll(async () => {
        const filename = "../../../data/person.jsonld"
        person = await parseJSON(filename)
        expect(person).toBeDefined()
        // console.debug(`Input from file: ${filename}`)

        // console.debug(person)
    })

    test("basic flatten from remote", async () => {
        console.log("basic flatten remote")

        // const ctx = person["@context"]
        // console.log(ctx)
        const url = "https://schema.org/version/latest/schemaorg-current-https.jsonld"

        const res = await jsonld.flatten(url)
        // const res = await jsonld.compact(url, "https://schema.org/docs/jsonldcontext.jsonld")

        console.log("result", prettyPrint(res))
    })

    test("property lookup", async () => {
        const out = await propertyTypeLookup(person)

        console.log("result", out)
    })
})
