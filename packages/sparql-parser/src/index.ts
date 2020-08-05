export const LIBRARY_VERSION = "0.1.0"
export const SPARQL_VERSION = "1.1"

import { W3SpecSparqlParser, traverse } from "millan" //"millan/dist/standalone/millan.sparql"
import { IRecognitionException, CstNode } from "chevrotain"

import { SparqlQuery, SelectQuery, Wildcard } from "sparqljs"

export const sparqlParser = new W3SpecSparqlParser()

export type Out = SparqlQuery
export type ErrorList = IRecognitionException[]

const selectQuery = (node: CstNode): SelectQuery => {
    const sc = node.children["SelectClause"][0] as CstNode
    if (!sc) {
        throw new Error("No select clause in select query")
    }
    let vars
    if ("Star" in sc.children) {
        vars = [Wildcard]
    } else if ("Var" in sc.children) {
        const vs = sc.children["Var"]
        console.log(vs)

        vs.forEach((node: CstNode) => {
            console.log(node)
        })
    }
    return {
        prefixes: {},
        type: "query",
        queryType: "SELECT",
        variables: vars,
    }
}

export const parse = (text: string): Out | ErrorList => {
    const out = sparqlParser.parse(text)
    if (out.errors.length !== 0) {
        return out.errors
    }
    traverse(out.cst, (ctx, next) => {
        console.log("got node", ctx.node)
        let node = ctx.node as CstNode
        if (node.name == "QueryUnit") {
            next(node.children["Query"])
        } else if (node.name == "Query") {
            if (node.children["SelectQuery"]) {
                const first = node.children["SelectQuery"][0]
                console.log(first)

                selectQuery(first as CstNode)
                // console.log(JSON.stringify(node, undefined, 2))
            }
        }
        // ctx.node
    })
}
