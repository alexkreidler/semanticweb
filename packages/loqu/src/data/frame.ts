import * as jsonld from "jsonld"
import { arrCmp } from "../utils"

import { Options } from "jsonld"
import { Strictness } from "./constraints"

/** typedFrame performs the JSON-LD framing operation and returns a strongly typed object.
 * The type garuantees are only valid if certain options are provided and checks are done aterwards */
export async function typedFrame<T extends object>(data: any, frame: T, opts?: Options.Frame): Promise<FrameMap<T>> {
    return (jsonld.frame(data, frame, opts) as unknown) as FrameMap<T>
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

/** FrameMap maps an input frame to a strongly typed output of the frame result. We preserve the type of context as is */
export type FrameMap<T> = {
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
