import { Resource } from "alcaeus"
import { Hydra } from "alcaeus/web"
import { toJSON } from "../rdfine/index"
export const doOperationByID = async (resource: string, operation: string) => {
    let r: Resource
    try {
        const z = await Hydra.loadResource(resource)
        if (!z) {
            throw new Error("No valid response")
        }
        const x = z.representation?.root
        if (!x) {
            throw new Error("No root resource")
        }
        r = x
    } catch (err) {
        throw err
    }
    const ops = r.getOperationsDeep().filter((op) => {
        return op.supportedOperation.id.value == operation
    })
    if (ops.length !== 1) {
        throw new Error("Found invalid number of operations")
    }
    const op = ops[0]

    const out = (await op.invoke()).representation?.root!
    console.log(await toJSON(out))
    return out
}
