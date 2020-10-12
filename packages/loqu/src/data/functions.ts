import { Options } from "jsonld"
import { JsonLd } from "jsonld/jsonld-spec"
import { FrameMap, frameWithChecks } from "./frame"
import { Conversion, Strictness } from "./constraints"

export type SFunc<F, T> = (data: FrameMap<F>) => T
/** Do we want to make this generic over return types? */
export type SemanticFunction<F extends object, T> = {
    data: {
        strictness: Strictness
        conversion?: Conversion
        frame: {
            spec: F
            opts?: Options.Frame
        }
    }
    /** In this case, the function doesn't have a return value as this
     * isn't a generation, validation, or conversion processing node */
    func: SFunc<F, T>
}

export function defaultSemanticFunction(): SemanticFunction<{}, void> {
    return {
        data: {
            // what should this default be
            strictness: Strictness.FrameStrict,
            // conversion: Conversion.None,
            frame: {
                spec: {},
            },
        },
        func: (data: JsonLd) => {},
    }
}

export function createSemanticFunction<F extends object, T>(frame: F, func: SFunc<F, T>): SemanticFunction<F, T> {
    let sf = defaultSemanticFunction()
    sf.data.frame.spec = frame
    sf.func = func
    // This assertion only works because we set func to func. This needs to stay coupled with
    // this set of APIs
    return sf as SemanticFunction<F, T>
}

// RUN

export async function runSingleFunc<F extends object, T>(sf: SemanticFunction<F, T>, data: JsonLd): Promise<T> {
    const framed = await frameWithChecks(data, sf.data.frame.spec, sf.data.strictness)

    const output = sf.func(framed)
    return output
}
