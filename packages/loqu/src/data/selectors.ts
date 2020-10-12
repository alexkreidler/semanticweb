import { Source } from "rdf-js"

/** Determines when a semantic component or processor should be applies */
export type Selector = IRISelector | FunctionSelector | MatchSelector

/** MatchSelector calls Dataset.match(matchArgs) based on the given backing dataset. It returns true if any quads are emitted, false otherwise.
 * Is there a real use-case for this?
 */
export type MatchSelector = {
    matchArgs: Parameters<Source["match"]>
}

/** This matches if the potential node's IRI is the same, or matches a regex
 */
export type IRISelector = {
    iri: string | RegExp
}

/** This executes a function to determine if the component matches the node */
export type FunctionSelector = {
    // what type should data be: a clownface pointer? an rdf/js namednode, with another parameter for the dataset?
    enabled: (data: any) => boolean
}
