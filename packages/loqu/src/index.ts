import { Frame, JsonLd } from "./jsonld-types"

import * as jsonld from "jsonld"
import { Options } from "jsonld"
import { arrCmp } from "./utils"

// Should this strictness type be only used for the framing operation
// Or should it be used to run additional processing on the data?
export enum Strictness {
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
export enum Conversion {
    None,
    /** Basic conversion converts xsd data types to JS. Can JSON-LD do this or do we need another lib?
     * Right now most of our test data is exclusively string. We should test with `Number`s and `Date`s */
    BasicConversion,
}

/**
 * API Module boundary
 */
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
/**
 * End API Module boundary
 */

/** FrameMap maps an input frame to a strongly typed output of the frame result. We preserve the type of context as is */
export type FrameMap<T extends any> = {
    [K in keyof T]: K extends "@context"
        ? T[K]
        : T[K] extends object
        ? any // this handles all @embed options (e.g. a string ID vs an object)
        : T[K] extends string
        ? string
        : T[K] extends object[] // This doesn't work yet
        ? any[]
        : unknown
}

/** typedFrame performs the JSON-LD framing operation and returns a strongly typed object.
 * The type garuantees are only valid if certain options are provided and checks are done aterwards */
export async function typedFrame<T extends object>(data: any, frame: T, opts?: Options.Frame): Promise<FrameMap<T>> {
    return ((await jsonld.frame(data, frame, opts)) as unknown) as FrameMap<T>
}

export async function frameWithChecks<T extends object>(
    data: any,
    frame: T,
    strictness: Strictness,
    opts?: Options.Frame
): Promise<FrameMap<T> | undefined> {
    /* Prepare frame options */
    let frameOpts: Options.Frame = {}

    switch (strictness) {
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
            throw new Error("Currently other validation types have not been implemented")
    }

    /** For this to have strong garuantees, out strictness options need to override the provided options */
    const realFrameOpts = { ...opts, ...frameOpts }
    const framed = await typedFrame(data, frame, realFrameOpts)

    if (arrCmp(Object.keys(framed), ["@context"])) {
        // No data was returned
        return undefined
    }

    return framed
}

export async function runSingleFunc<F extends object, T>(sf: SemanticFunction<F, T>, data: JsonLd): Promise<T> {
    const framed = await frameWithChecks(data, sf.data.frame.spec, sf.data.strictness)

    const output = sf.func(framed)
    return output
}

export * from "./genericHelpers"
export * from "./rdfineHelpers"

export type IDNode = {
    "@id": string
}
