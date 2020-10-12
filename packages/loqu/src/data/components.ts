import { DataSpec, JsonLDData, JsonLDToForm, OutData, RDFJSData } from "./formats"
import { Selector } from "./selectors"
import { Conversion, Strictness } from "./constraints"
import clownface from "clownface"
import RdfResourceImpl from "@tpluscode/rdfine/RdfResource"
import { typedFrame } from "./frame"
import { assertUnreachable } from "../utils"

/** Do we want to make this generic over return types? */
export type SemanticComponent<R extends DataSpec> = {
    selector: Selector
    /** Options to control the preprocessing of the input data */
    data: {
        strictness: Strictness
        conversion?: Conversion
        spec: R
    }
    /** The component or element to render */
    component: (props: SCProps<R>) => React.ReactNode
}

export type SCProps<R extends DataSpec> = {
    data: OutData<R>
    spec: R
}

// Should this be async to allow for JSON-LD processing
/** Renders a single component where the Node to render is already known. No selector is run */
export function renderSingleComponent<T extends DataSpec>(
    component: SemanticComponent<T>,
    data: RDFJSData
): React.ReactNode {
    // TODO: add user hooks here to make sure that RDFine ResourceFactory has all relevant mixins registered

    const spec = component.data.spec
    switch (spec.format) {
        case "rdf/js":
            //@ts-ignore
            return component.component({ data: data, spec })
            break

        case "clownface":
            return component.component({
                //@ts-ignore
                data: { pointer: clownface({ dataset: data.dataset }).namedNode(data.node) },
                spec,
            })

        case "rdfine":
            const res = RdfResourceImpl.factory.createEntity(clownface({ dataset: data.dataset }).namedNode(data.node))
            //@ts-ignore
            return component.component({ data: { object: res }, spec })

        case "jsonld":
            //@ts-ignore
            return component.component({ data: processJsonLDDocument(spec as JsonLDToForm, data), spec })
    }
    return assertUnreachable(spec.format) //`Failed to render component, unkown data format ${spec.format} in component spec`
}

export function processJsonLDDocument<F, C>(spec: JsonLDToForm<F, C>, data: RDFJSData): JsonLDData<any> {
    switch (spec.form) {
        case "framed":
            return { document: typedFrame(data, (spec.frameSpec as unknown) as object, spec.frameOpts) }

        case "compacted":
            return { document: {} }

        case "expanded":
            return { document: {} }
        case "flattened":
            return { document: {} }

        default:
            //@ts-ignore
            return assertUnreachable(spec.form)
    }
    // return { document: {} }
}
