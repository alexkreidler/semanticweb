import { Class, RdfResource, Resource } from "alcaeus" // (or 'alcaeus/node')
import { SupportedProperty } from "@rdfine/hydra"
import { Hydra } from "alcaeus/web"

import _ from "lodash"

export type Entity = { class: Class; resource: Resource }

export async function getEntities(url: string): Promise<Entity[]> {
    const { response, representation } = await Hydra.loadResource(url)
    const rootResource = representation!.root! as RdfResource

    //@ts-ignor
    const links: { supportedProperty: SupportedProperty; resources: RdfResource[] }[] = (rootResource as any).getLinks()

    const classes = links.map((l) => ({
        class: l.supportedProperty.property!.range!,
    }))

    const resUnique = links.map((l) => {
        if (l.resources.length > 1) {
            throw new Error("Multiple links?!")
        }
        return { resource: l.resources[0] }
    })

    const out = _.merge(classes, resUnique)

    return out as Entity[]
}
