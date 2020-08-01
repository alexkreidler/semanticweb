import React from "react"

import { ok, err, ResultAsync, Result } from "neverthrow"
// TODO: reevaluate if this poses too much API burden on consumers

type Empty = {}
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

type Error = ParseError | NotFoundError | InvalidComponentError

export interface IComponentRegistry<DataProps> {
    registerCallback: () => void
    handleCallback: () => void
    register(iri: IRI, component: React.ReactNode): Result<Empty, Error>
    // this is called from the context of the @type field in a data object
    // however, the system should expand to use @base and @vocab

    // undefined is a valid react node. Should we fail silently??
    handle(iri: IRI): Result<React.FC<DataProps>, NotFoundError>
    // Result<React.ReactNode, NotFoundError>
}

const normalizeIRI = (iri: string): string => {
    console.debug("input iri", iri)
    // TODO: think about more complex normalization
    let out = iri.replace(/^http:\/\//i, "https://")
    console.debug("output iri", out)
    return out
}

export class ComponentRegistry<DataProps>
    implements IComponentRegistry<DataProps> {
    private map: { [key: string]: React.FC<DataProps> } = {}
    constructor() {}
    registerCallback: () => void = () => {}
    handleCallback: () => void = () => {}
    register(
        iri: string,
        component: React.FC<DataProps>
    ): Result<Empty, Error> {
        // TODO: validate IRI
        iri = normalizeIRI(iri)

        if (component == undefined) {
            return err({ message: "Invalid Component" })
        }

        this.map[iri] = component

        this.registerCallback()
        return ok({})
    }
    handle(iri: string): Result<React.FC<DataProps>, NotFoundError> {
        iri = normalizeIRI(iri)
        // TODO: should require full IRI?
        let component = this.map[iri]
        if (component == undefined) {
            return err({ message: "Component Not Found" })
        }
        this.handleCallback()
        return ok(component)
    }
}
