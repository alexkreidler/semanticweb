import { Frame, JsonLd } from "./jsonld-types"

import * as jsonld from "jsonld"

import { prettyPrint } from "./utils"
export async function propertyTypeLookup(data: JsonLd) {
    const cmp = await jsonld.compact(data, {})
    const url = "https://schema.org/version/latest/schemaorg-current-http.jsonld"

    const res = await jsonld.flatten(url)
    // console.log(prettyPrint(res))
    for (let [k, v] of Object.entries(cmp)) {
        if (typeof v == "string") {
            console.log("Looking property:", k)

            let graph: [{ "@id": string; "@type": string }] = res[0]["@graph"]
            const propData = graph.filter((v) => v["@id"] == k)
            // const propData = res[k]
            console.log(prettyPrint(propData))
        }
    }
    console.log(prettyPrint(cmp))
}
