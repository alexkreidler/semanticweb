import { DataSpec, JsonLDData, JsonLDToForm, OutData, RDFJSData } from "./formats"
import { Selector } from "./selectors"
import { Conversion, Strictness } from "./constraints"
import clownface from "clownface"

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
    const spec = component.data.spec
    switch (spec.format) {
        case "rdf/js":
            return component.component({ data: data, spec })
            break

        case "clownface":
            return component.component({ data: { pointer: clownface(data.node) }, spec })

        case "rdfine":
            return component.component({ data: data, spec })

        default:
            return `Failed to render component, unkown data format ${spec.format} in component spec`
    }
}
