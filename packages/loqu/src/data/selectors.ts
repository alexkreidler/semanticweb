import { Dataset } from "rdf-js"
import { assertUnreachable, findSimilarity, UnreachableCaseError } from "../utils"
import { Metadata, SemanticComponent } from "./components"
import { DataSpec, RDFJSData } from "./formats"

/** Determines when a semantic component or processor should be applies */
export type Selector = BasicSelector & (IRISelector | FunctionSelector | MatchSelector)

export type BasicSelector = {
    priority?: number
}

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

export function doesSelectorMatch(selector: Selector, data: RDFJSData): boolean {
    switch (selector.type) {
        case "match":
            if (selector.mode == MatchMode.MoreThanOne) {
                return data.dataset.match(...selector.matchArgs).size > 1
            } else {
                return selector.size == data.dataset.match(...selector.matchArgs).size
            }
        case "iri":
            const iri = data.node.value
            const out = iri.match(selector.iri)
            return out ? out.length > 0 : false

        case "function":
            return selector.enabled(data)
    }
}

// TODO: maybe add some rough estimation of priority based on the specificity of iri regex
export function handleSelectors<R extends DataSpec, P = {}>(
    s: SemanticComponent<R, P>[],
    data: RDFJSData,
    m?: Metadata
): SemanticComponent<R, P>[] {
    return s
        .filter((i) => doesSelectorMatch(i.selector, data))
        .sort((c, d) => {
            let aBonus
            let bBonus
            if (m) {
                aBonus = findSimilarity(c.metadata, m)
                bBonus = findSimilarity(d.metadata, m)
            }
            const a = c.selector
            const b = d.selector
            if (!a.priority) {
                a.priority = 0
            }
            if (!b.priority) {
                b.priority = 0
            }
            console.log(a.priority, aBonus, b.priority, bBonus)

            const sval = a.priority + aBonus - (b.priority + bBonus)
            // Sorts highest to lowest
            return -sval
        })
}
