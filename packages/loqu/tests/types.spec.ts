import { parseJSON, prettyPrint } from "../src/utils"

import * as jsonld from "jsonld"

describe("types", () => {
    let person
    beforeAll(async () => {
        const filename = "../../../data/person.jsonld"
        person = await parseJSON(filename)
        expect(person).toBeDefined()
        // console.debug(`Input from file: ${filename}`)

        // console.debug(person)
    })

    /** FrameMap maps an input frame to a strongly typed output of the frame result. We preserve the type of context as is */
    type FrameMap<T extends any> = {
        [K in keyof T]: K extends "@context"
            ? T[K]
            : T[K] extends object
            ? any
            : T[K] extends string
            ? string
            : T[K] extends [{}]
            ? [any]
            : unknown
    }

    async function typedFrame<T extends object>(data: any, frame: T): Promise<FrameMap<T>> {
        return ((await jsonld.frame(data, frame)) as unknown) as FrameMap<T>
    }

    test("basic", async () => {
        const framed = await typedFrame(person, {
            "@context": [
                "https://schema.org",
                {
                    worksFor: { "@id": "http://schema.org/worksFor", "@container": "@set" },
                },
            ],
            "@type": "Person",
            "@id": "http://example.com/Jane-Doe",
            address: {},
            worksFor: [{}],
            sameAs: {},
            email: "",
        })
        console.log(prettyPrint(framed))
        // console.log(jsonld.)

        expect(framed).toBeDefined()
    })
})
