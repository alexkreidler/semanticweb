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
                  },
                  "@id": requestedProperties,
                  "rdfs:label": {},
                  "rdfs:comment": {},
              },
        {
            explicit: true,
        }
    )
    const out = await jsonld.compact(framed, {
        "@context": {
            rdfs: "http://www.w3.org/2000/01/rdf-schema#",
            label: "rdfs:label",
            comment: "rdfs:comment",
        },
    })
    console.log(prettyPrint(out))
    return out["@graph"]
}
