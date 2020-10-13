import { Hydra } from "alcaeus/web"
import { toJSON } from "../rdfine/index"
export const doOperationByID = async (resource: string, operation: string) => {
    const { representation } = await Hydra.loadResource(resource)
    const r = representation?.root!
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
