import { sparqlParser, parse } from "./index"

test("can use millan parser", () => {
    const res = sparqlParser.tokenize(`
    PREFIX : <http://example.org/ns#>
    SELECT *
    WHERE { ?x ?y ?z }
    `)

    console.log(res)

    expect(res).toBeDefined()
})

test("can parse basic query", () => {
    const q = `SELECT * WHERE {
        ?s ?p ?o
      }`

    parse(q)
})
