export const LIBRARY_VERSION = "0.1.0"
export const SPARQL_VERSION = "1.1"

import { W3SpecSparqlParser, traverse } from "millan" //"millan/dist/standalone/millan.sparql"
import { IRecognitionException, CstNode } from "chevrotain"

import { SparqlQuery } from "sparqljs"

export const sparqlParser = new W3SpecSparqlParser()

export type Out = SparqlQuery
export type ErrorList = IRecognitionException[]

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
                console.log(JSON.stringify(node, undefined, 2))
            }
        }
        // ctx.node
    })
}
