/** The name of this file is based no the GenericNode file in the Sweb browser. we may change it */
import { RdfDereferencer } from "rdf-dereference"

import rDeref from "rdf-dereference"

import { prettyPrint, stream2String } from "./utils"

import * as jsonld from "jsonld"

import rdfSerializer from "rdf-serialize"
import { JsonLd, JsonLdObj } from "jsonld/jsonld-spec"

export async function dereferenceToFlatJsonLD(iri: string): Promise<JsonLd> {
    const rDDeref = rDeref as RdfDereferencer
    const { quads } = await rDDeref.dereference(iri)

    const textStream = rdfSerializer.serialize(quads, { contentType: "application/ld+json" })

    // Replace with jsonld.fromRDF
    const out = await stream2String(textStream)

    const obj = JSON.parse(out)
    const flat = await jsonld.flatten(obj, {})
    return flat
}

/** Returns a graph containing the IRIs and details (via a JSON-LD Frame) about a provided set of properties on a given class */
export async function getProperties(
    classIRI: string,
    requestedProperties: [string],
    frame?: object
): Promise<[JsonLdObj]> {
    const flat = await dereferenceToFlatJsonLD(classIRI)
    console.log(flat)

    console.log(prettyPrint(flat))

    if (frame && "@id" in frame) {
        console.error("The provided frame should not have an ID. This function uses requestedProperties as the ID list")
    }

    const framed = await jsonld.frame(
        flat,
        frame
            ? {
                  ...frame,
                  ...{
                      "@id": requestedProperties,
                  },
              }
            : {
                  "@context": {
                      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
                      label: "rdfs:label",
                      comment: "rdfs:comment",
                  },
                  "@id": requestedProperties,
                  label: {},
                  comment: {},
              },
        {
            explicit: true,
        }
    )
    const out = framed

    // await jsonld.compact(framed, {
    //     "@context": {
    //         rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    //         label: "rdfs:label",
    //         comment: "rdfs:comment",
    //     },
    // })
    // console.log(prettyPrint(out))
    console.log(out)

    return out["@graph"]
}

export type MinimumDataFormat = {}

export type PrepResult = {
    data: any
    properties: [object]
}

// TODO: improve type safety of this
export async function prepData(data: MinimumDataFormat): Promise<PrepResult> {
    const out: any = await jsonld.compact(data, {})
    console.log(out)

    let regularProperties: [string?] = []
    for (let [k, v] of Object.entries(out)) {
        if (typeof v == "string" && !k.includes("@")) {
            regularProperties.push(k)
        }
    }
    console.log(regularProperties)

    const typ = out["@type"]

    if (!typ) {
        throw new Error("No type found in compacted data")
    }

    if (regularProperties.length < 1) {
        throw new Error("There are no simple properties here to get")
    }
    let rp = regularProperties as [string]
    const properties = await getProperties(typ, rp)
    console.log(properties)

    return {
        data: out,
        properties,
    }
}
