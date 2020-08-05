import { sparqlParser } from "./index"

test("can use millan parser", () => {
    const res = sparqlParser.tokenize(`
    PREFIX : <http://example.org/ns#>
    SELECT *
    WHERE { ?x ?y ?z }
    `)

    console.log(res)

    expect(res).toBeDefined()
})
