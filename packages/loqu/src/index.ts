import { Frame, JsonLd } from "./jsonld-types"

import * as jsonld from "jsonld"
import { Options } from "jsonld"

enum Strictness {
    /** This just frames the data but doesn't impose any additional options */
    NoChecks,
    /** Frame strict mode enables both the Explicit Inclusion and the Require All
     * flags on the Frame. How to deal with no-data/error: a validation strategy? */
    FrameStrict,

    /** This checks that XSD data types are properly formatted */
    BasicValidation,

    /** This allows for custom validation using the shacl and other options. Not implemented */
    AdvancedValidation,
}
enum Conversion {
    None,
    /** Basic conversion converts xsd data types to JS */
    BasicConversion,
}

/**
 * API Module boundary
 */
export type SFunc<O, I = JsonLd> = (data: I) => O
/** Do we want to make this generic over return types? */
export type SemanticFunction<T> = {
    data: {
        strictness: Strictness
        conversion: Conversion
        frame: {
            spec: Frame
            opts: Options.Frame
        }
    }
    /** In this case, the function doesn't have a return value as this
     * isn't a generation, validation, or conversion processing node */
    func: SFunc<T>
}

export function defaultSemanticFunction(): SemanticFunction<void> {
    return {
        data: {
            // what should this default be
            strictness: Strictness.FrameStrict,
            conversion: Conversion.None,
            frame: {
                spec: {},
                opts: {},
            },
        },
        func: (data: JsonLd) => {},
    }
}

export function createSemanticFunction<T>(frame: Frame, func: SFunc<T>): SemanticFunction<T> {
    let sf = defaultSemanticFunction()
    sf.data.frame.spec = frame
    sf.func = func
    // This assertion only works because we set func to func. This needs to stay coupled with
    // this set of APIs
    return sf as SemanticFunction<T>
}
/**
 * End API Module boundary
 */

export async function runSingleFunc<T>(sf: SemanticFunction<T>, data: JsonLd): Promise<T> {
    /* Prepare frame options */
    let frameOpts: Options.Frame = {}
    switch (sf.data.strictness) {
        case Strictness.NoChecks:
            frameOpts = {}
            break

        case Strictness.FrameStrict:
            frameOpts = {
                requireAll: true,
                explicit: true,
            }
            break

        default:
            console.log("Currently other validation types have not been implemented")

            break
    }
    /* We merge in the explicitly provided options, setting them to override */
    const realFrameOpts = { ...frameOpts, ...sf.data.frame.opts }

    const framed = await jsonld.frame(data, sf.data.frame.spec, realFrameOpts)

    const output = sf.func(framed)
    return output
}

export * from "./genericHelpers"
export * from "./rdfineHelpers"

export type IDNode = {
    "@id": string
}
