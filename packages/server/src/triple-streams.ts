import stream from "stream"
import { EventEmitter } from "events"

export interface ReadableObjStream<T>
    extends Omit<stream.Readable, "push" | "read"> {}

// Use extends (TYPE as any) to avoid compilation errors and override `Omit`-ted methods
export class ReadableObjStream<T> extends (stream.Readable as any) {
    constructor() {
        super({ objectMode: true }) // force object mode. You can merge it with original options
    }
    // Override `Omit`-ed methods with YOUR CUSTOM SIGNATURE (can be non-comatible with parent):
    push(myOwnNonCompatibleSignature: T): string {
        return "" /* implementation*/
    }
    read(options_nonCompatibleSignature: { opts: keyof T }): string {
        return "" /* implementation*/
    }
}

let typedReadable = new ReadableObjStream<{ myData: string }>()

export interface WritableObjStream<T>
    extends Omit<stream.Writable, "write" | "read"> {}

export class WritableObjStream<T> extends (stream.Writable as any) {
    writableObjectMode: true

    write(object: T, cb?: (error: Error | null | undefined) => void): boolean {
        let s: NodeJS.WritableStream = undefined;
        EventEmitter
        // @ts-ignore
        s = super

        return s.write()
    }

    read(size?: number): T[] {

    }
    // write(
    //     chunk: any,
    //     encoding: string,
    //     cb?: (error: Error | null | undefined) => void
    // ): boolean {
    //     return true
    // }
}
