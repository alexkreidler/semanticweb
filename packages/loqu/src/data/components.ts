import { DataSpec, JsonLDData, JsonLDToForm } from "./formats"
import { Selector } from "./selectors"
import { Conversion, Strictness } from "./constraints"

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
    component: ({ data }: { data: R extends JsonLDToForm ? JsonLDData<R> : R }) => React.ReactNode
}
