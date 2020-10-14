import { Dataset } from "rdf-js"
import { assertUnreachable, UnreachableCaseError } from "../utils"
import { RDFJSData } from "./formats"

/** Determines when a semantic component or processor should be applies */
export type Selector = IRISelector | FunctionSelector | MatchSelector

export enum MatchMode {
    MoreThanOne,
    Specific,
}

/** MatchSelector calls Dataset.match(matchArgs) based on the given backing dataset. It returns true if any quads are emitted, false otherwise.
 * Is there a real use-case for this?
 */
export type MatchSelector = {
    type: "match"
    matchArgs: Parameters<Dataset["match"]>
    mode: MatchMode
    size?: number
}

/** This matches if the potential node's IRI is the same, or matches a regex
 */
export type IRISelector = {
    type: "iri"
    iri: string | RegExp
}

/** This executes a function to determine if the component matches the node */
export type FunctionSelector = {
    type: "function"
    // what type should data be: a clownface pointer? an rdf/js namednode, with another parameter for the dataset?
    enabled: (data: any) => boolean
}

export function handleSelector(selector: Selector, data: RDFJSData): boolean {
    switch (selector.type) {
        case "match":
            if (selector.mode == MatchMode.MoreThanOne) {
                return data.dataset.match(...selector.matchArgs).size > 1
            } else {
                return selector.size == data.dataset.match(...selector.matchArgs).size
            }
        case "iri":
            return data.node.value.match(selector.iri).length > 0

        case "function":
            return selector.enabled(data)
    }
}
