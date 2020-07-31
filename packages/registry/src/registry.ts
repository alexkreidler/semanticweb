import React from "react"

import { ok, err, ResultAsync, Result } from "neverthrow"

type Empty = {}
type IRI = string

type ParseError = {
    message: "Invalid IRI"
}

type NotFoundError = {
    message: "Component Not Found"
}

type Error = ParseError | NotFoundError

export interface IComponentRegistry {
    register(iri: IRI, component: React.ReactNode): Result<Empty, ParseError>
    // this is called from the context of the @type field in a data object
    // however, the system should expand to use @base and @vocab

    // undefined is a valid react node. Should we fail silently??
    handle(iri: IRI): React.ReactNode
    // Result<React.ReactNode, NotFoundError>
}

export class ComponentRegistry implements IComponentRegistry {
    map: { [key: string]: React.ReactNode }
    constructor() {}
    register(
        iri: string,
        component: React.ReactNode
    ): Result<Empty, ParseError> {
        // TODO: validate IRI

        this.map[iri] = component
        return ok({})
    }
    handle(iri: string): Result<React.ReactNode, NotFoundError> {
        // TODO: should require full IRI?
        let component = this.map[iri]
        return ok(component)
    }
}
