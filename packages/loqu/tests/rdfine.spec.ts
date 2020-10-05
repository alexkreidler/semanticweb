import { toJSON } from "../src/rdfineHelpers"

import RdfResource from "@tpluscode/rdfine/RdfResource"
import cf from "clownface"

import { parse, ex } from "./testUtils"

describe("rdfine", () => {
    it("returns an iterable set of resource's types", async () => {
        // given
        const dataset = await parse(`
        @prefix ex: <${ex().value}> .
        
        ex:res a ex:Type1, ex:Type2, ex:Type3, ex:Type4 .
      `)
        const node = cf({
            dataset,
        }).namedNode(ex.res)

        // when
        const tc = new RdfResource(node).types

        // then
        expect([...tc.values()].map((r) => r.id)).toEqual(
            expect.arrayContaining([ex.Type1, ex.Type2, ex.Type3, ex.Type4])
        )
    })

    it("returns JSON-LD", async () => {
        // given
        const dataset = await parse(`
        @prefix ex: <${ex().value}> .
        
        ex:res a ex:Type1, ex:Type2, ex:Type3, ex:Type4 .
      `)
        const node = cf({
            dataset,
        }).namedNode(ex.res)

        // when
        const res = new RdfResource(node)

        const out = await toJSON(res)

        // console.log(out)

        // then
        expect(out).toBeDefined()
        expect(out["@id"]).toEqual(ex.res.value)
        expect(out["@type"].length).toEqual(4)
    })

    // TODO: write tests for toJSON for multiple graphs
})
