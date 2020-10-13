import { property } from "@tpluscode/rdfine"
import type { Constructor, RdfResource } from "@tpluscode/rdfine"
import { hydra, rdfs, schema } from "@tpluscode/rdf-ns-builders"
import { ResourceNode } from "@tpluscode/rdfine/RdfResource"

export interface DocumentedResource {
    /**
     * Gets the value of either hydra:title or schema:title or rdfs:label property
     */
    title: string
    /**
     * Gets the value of either hydra:description or schema:description or rdfs:comment property
     */
    description: string
}

function getTitle(res: RdfResource) {
    return res.pointer.out([hydra.title, rdfs.label, schema.title])
}

function getDescription(res: RdfResource) {
    return res.pointer.out([hydra.description, rdfs.comment, schema.description])
}

export function DocumentedResourceMixin<TBase extends Constructor>(Base: TBase) {
    class DocumentedResourceClass extends Base implements DocumentedResource {
        @property.literal({ path: hydra.title })
        public __hydraTitle!: string

        @property.literal({ path: hydra.description })
        public __hydraDescription!: string

        @property.literal({ path: rdfs.label })
        public __rdfsLabel!: string

        @property.literal({ path: rdfs.comment })
        public __rdfsComment!: string

        @property.literal({ path: schema.title })
        public __schemaTitle!: string

        @property.literal({ path: schema.description })
        public __schemaDescription!: string

        public get description(): string {
            return this.__hydraDescription || this.__rdfsComment || this.__schemaDescription
        }

        public get title(): string {
            return this.__hydraTitle || this.__rdfsLabel || this.__schemaTitle
        }

        constructor(...args: any[]) {
            super(...args)
            // this.types.add(hydra.Resource)
        }
    }

    return DocumentedResourceClass
}

DocumentedResourceMixin.shouldApply = function (res: RdfResource) {
    const hasDescription = getDescription(res).terms.length > 0
    const hasTitle = getTitle(res).terms.length > 0

    return hasDescription || hasTitle
}
