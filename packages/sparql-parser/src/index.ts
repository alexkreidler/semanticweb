export const LIBRARY_VERSION = "0.1.0"
export const SPARQL_VERSION = "1.1"

// import { W3C } from "millan/dist/standalone/millan.sparql"
import { W3SpecSparqlParser } from "millan"
export const sparqlParser = new W3SpecSparqlParser()
