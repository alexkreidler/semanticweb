import stream from "stream"
import { EventEmitter } from "events"

export interface ReadableObjStream<T> extends Omit<stream.Readable, "read"> {}

// Use extends (TYPE as any) to avoid compilation errors and override `Omit`-ted methods
export class ReadableObjStream<T> extends (stream.Readable as any) {
    constructor() {
        super({ objectMode: true }) // force object mode. You can merge it with original options
    }

    // We don't want to restrict the size of the read in bytes in object mode
    read(): T {
        // const swrite = new stream.Readable()
        // let r: typeof swrite.read = super.write

        return super.read()
    }
}

let typedReadable = new ReadableObjStream<{ myData: string }>()

export interface WritableObjStream<T> extends Omit<stream.Writable, "write"> {}

export class WritableObjStream<T> extends (stream.Writable as any) {
    constructor() {
        super({ objectMode: true }) // force object mode. You can merge it with original options
    }

    // eh
    // purely for typing purposes
    // private swrite

    write(object: T, cb?: (error: Error | null | undefined) => void): boolean {
        const swrite = new stream.Writable()
        let w: typeof swrite.write = super.write

        return w(object, cb)
    }
}
