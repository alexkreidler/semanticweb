import * as jsonld from "jsonld"
// We only need this for the compile/dev time interface typings, and for tests
import { RdfResource } from "@tpluscode/rdfine/RdfResource"

import { JsonLdArray } from "jsonld/jsonld-spec"

export const toJSON = async (resource: RdfResource): Promise<any> => {
    // First we serialize to JSON-LD from the dataset
    const graphsOrItems = await jsonld.fromRDF(resource.pointer.dataset)
    // Then we'll set up some helper types to ensure compile time type-safety
    // In the future we may want to add checks to make sure the data follows these requirements at runtime
    // Then we handle whether the dataset that is backing our current pointer has multiple graphs by finding the one matching resource._graphId
    // Then we find the current item identifiable with resource.id

    type MinimalGraph = {
        "@id": string
        "@graph": any[]
    }
    type MultiGraph = [MinimalGraph]
    // Difference between [T] and T[] is that [T] must have at least one item

    const multipleGraphs = (graphs: JsonLdArray): graphs is MultiGraph => {
        return "@graph" in graphs[0]
    }

    type MinimalItem = {
        "@id": string
    }

    const currentItem = (items: MinimalItem[]): any => {
        const resultItems = items.filter((item) => item["@id"] === resource.id.value)

        if (resultItems.length !== 1) {
            // console.error("Result items", resultItems);
            throw new Error(
                `Incorrect number of result items: ${resultItems.length} returned for current item id: ${resource.id.value}\n`
            )
        }
        return resultItems[0]
    }

    if (multipleGraphs(graphsOrItems)) {
        const itemGraphs = graphsOrItems.filter((g) => g["@id"] === resource._graphId.value)
        if (itemGraphs.length !== 1) {
            throw new Error(
                `Incorrect number of graphs: ${itemGraphs.length} returned for current graph id: ${resource._graphId.value}`
            )
            // Possible additional error text: Either the current node is not contained in any graph, or it is contained in multiple
        }
        const items = itemGraphs[0]["@graph"]
        return currentItem(items)
    } else {
        // Should we do an additional check here to make sure each item really has an ID?
        return currentItem(graphsOrItems as MinimalItem[])
    }
}
