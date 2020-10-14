import { DataSpec, JsonLDData, JsonLDToForm, OutData, RDFJSData } from "./formats"
import { Selector } from "./selectors"
import { Conversion, Strictness } from "./constraints"
import clownface from "clownface"
import RdfResourceImpl from "@tpluscode/rdfine/RdfResource"
import { typedFrame } from "./frame"
import { assertUnreachable } from "../utils"
import { DocumentedResourceMixin } from "../rdfine/DocumentedResourceMixin"

// import * as Extensions from "alcaeus/Resources/Mixins"
// import * as Hydra from "@rdfine/hydra"
// import { DocumentedResourceMixin } from "alcaeus/Resources/Mixins"

/** This metadata helps us narrow the selection, and allows distinguishing between different UI views of the same object.
 * It may be assigned a JSON-LD/rdf meaning
 */
export type Metadata = {
    // componentID: string
    // componentGroup: string
    uiContext?: string
}

/** Do we want to make this generic over return types? */
export type SemanticComponent<R extends DataSpec, P = {}> = {
    id: string
    selector: Selector
    metadata?: Metadata
    /** Options to control the preprocessing of the input data */
    data: {
        strictness: Strictness
        conversion?: Conversion
        spec: R
    }
    /** The component or element to render */
    component: (props: SCProps<R, P>) => React.ReactNode
}

export type SCProps<R extends DataSpec, P = {}> = {
    data: OutData<R>
    spec: R
    // In the future, should this be required?
    props?: P
}

function preRenderHook() {
    RdfResourceImpl.factory.addMixin(DocumentedResourceMixin)
    // factory.addMixin(...Object.values(Hydra))
    // factory.addMixin(...Object.values(Extensions))
}

// Should this be async to allow for JSON-LD processing
// when adding a generic argument, the type parameters referenced are inferred
/** Renders a single component where the Node to render is already known. No selector is run */
export function renderSingleComponent<R extends DataSpec, P>(
    component: SemanticComponent<R, P>,
    data: RDFJSData,
    props?: P
): React.ReactNode {
    // TODO: add user hooks here to make sure that RDFine ResourceFactory has all relevant mixins registered

    preRenderHook()

    const spec = component.data.spec

    const baseProps = { spec, props }

    switch (spec.format) {
        case "rdf/js":
            //@ts-ignore
            return component.component({ data: data, ...baseProps })
            break

        case "clownface":
            return component.component({
                //@ts-ignore
                data: { pointer: clownface({ dataset: data.dataset }).namedNode(data.node) },
                ...baseProps,
            })

        case "rdfine":
            const res = RdfResourceImpl.factory.createEntity(clownface({ dataset: data.dataset }).namedNode(data.node))
            //@ts-ignore
            return component.component({ data: { object: res }, ...baseProps })

        case "jsonld":
            //@ts-ignore
            return component.component({ data: processJsonLDDocument(spec as JsonLDToForm, data), ...baseProps })
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
