import { DataSpec, JsonLDData, JsonLDToForm, OutData, RDFJSData } from "./formats"
import { Selector } from "./selectors"
import { Conversion, Strictness } from "./constraints"
import clownface, { GraphPointer } from "clownface"
import RdfResourceImpl from "@tpluscode/rdfine/RdfResource"
import { typedFrame } from "./frame"
import { assertUnreachable, dSize } from "../utils"
import { DocumentedResourceMixin } from "../rdfine/DocumentedResourceMixin"
import { DatasetCore } from "rdf-js"
import { RDFJS2Clownface } from "./conversions"
import { Metadata } from "./metadata"
import { JsonLdProcessor } from "jsonld"

import * as Extensions from "alcaeus/Resources/Mixins"
import * as Hydra from "@rdfine/hydra"
import { Resource } from "alcaeus"

import * as jsonld from "jsonld"

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
    rdfData: RDFJSData
}

function preRenderHook() {
    RdfResourceImpl.factory.addMixin(DocumentedResourceMixin)
    RdfResourceImpl.factory.addMixin(...Object.values(Hydra))
    RdfResourceImpl.factory.addMixin(...Object.values(Extensions))
}

// Should this be async to allow for JSON-LD processing
// when adding a generic argument, the type parameters referenced are inferred
/** Renders a single component where the Node to render is already known. No selector is run */
export async function renderSingleComponent<R extends DataSpec, P>(
    component: SemanticComponent<R, P>,
    data: RDFJSData,
    props?: P
): Promise<React.ReactNode> {
    // TODO: add user hooks here to make sure that RDFine ResourceFactory has all relevant mixins registered

    // dSize(data)

    // console.log("Render single", component, data, props)

    // preRenderHook()

    const spec = component.data.spec

    const rdfData = data

    const baseProps = { spec, props, rdfData }

    switch (spec.format) {
        case "rdf/js":
            //@ts-ignore
            return component.component({ data: data, ...baseProps })
            break

        case "clownface":
            return component.component({
                //@ts-ignore
                data: RDFJS2Clownface(data),
                ...baseProps,
            })

        case "rdfine":
            const ps = RDFJS2Clownface(data).pointer
            const res = RdfResourceImpl.factory.createEntity<Resource>(ps as GraphPointer)
            console.log(res.toJSON())

            //@ts-ignore
            return component.component({ data: { object: res }, ...baseProps })

        case "jsonld":
            //@ts-ignore
            return component.component({ data: await processJsonLDDocument(spec as JsonLDToForm, data), ...baseProps })
    }
    return assertUnreachable(spec.format) //`Failed to render component, unkown data format ${spec.format} in component spec`
}

export async function processJsonLDDocument<F, C>(
    spec: JsonLDToForm<F, C>,
    data: RDFJSData
): Promise<JsonLDData<JsonLDToForm<F, C>>> {
    const json = await jsonld.fromRDF(data.dataset)

    switch (spec.form) {
        case "framed":
            // return { document: {} }
            const framed = await typedFrame(json, (spec.frameSpec as unknown) as object, spec.frameOpts)
            console.log(framed)

            return { document: framed }

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
