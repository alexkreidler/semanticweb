import { DataSpec, handleSelector, RDFJSData, SemanticComponent } from "../data"

type IRI = string

type ParseError = {
    message: "Invalid IRI"
}

type InvalidComponentError = {
    message: "Invalid Component"
}

type NotFoundError = {
    message: "Component Not Found"
}
type IncorrectSelection = {
    message: "Incorrect number of selected components"
}

type Error = ParseError | NotFoundError | InvalidComponentError | IncorrectSelection

export interface IComponentRegistry {
    register<R extends DataSpec, P>(component: SemanticComponent<R, P>): Error | undefined
    handle<R extends DataSpec, P>(dataItem: RDFJSData): SemanticComponent<R, P> | Error
}
export interface IRegistryHooks {
    registerCallback: () => void
    handleCallback: () => void
}

const normalizeIRI = (iri: string): string => {
    console.debug("input iri", iri)
    // TODO: think about more complex normalization
    let out = iri.replace(/^https:\/\//i, "http://")
    console.debug("output iri", out)
    return out
}

export class ComponentRegistry implements IComponentRegistry {
    private map: Record<string, SemanticComponent<any, any>> = {}
    constructor() {
        if ((window as any).loquRegistryCreated) {
            console.warn("An instance of the Loqu Registry has already been created")
        }
        ;(window as any).loquRegistryCreated = true
    }
    registerCallback: () => void = () => {}
    handleCallback: () => void = () => {}
    register<R extends DataSpec, P>(component: SemanticComponent<R, P>): Error | undefined {
        // TODO: validate IRI
        const iri = normalizeIRI(component.id)

        if (component == undefined) {
            return { message: "Invalid Component" }
        }

        this.map[iri] = component

        this.registerCallback()
        return undefined
    }
    // TODO: should this be a single function?
    // Or should we just expose a list of all components
    // With complex selectors, multiple components could claim a stake on a data object
    // Additionally, UI state like a switcher between list and grid view may change the uiContext and which one gets rendered
    handle<R extends DataSpec, P>(dataItem: RDFJSData): SemanticComponent<R, P> | Error {
        const selected = Object.entries(this.map)
            .map(([k, v]) => ({ s: handleSelector(v.selector, dataItem), obj: v }))
            .filter((b) => b.s)

        if (selected.length !== 1) {
            return { message: "Incorrect number of selected components" }
        }
        const c = selected[0].obj

        return c
    }
}

export const Registry = new ComponentRegistry()
