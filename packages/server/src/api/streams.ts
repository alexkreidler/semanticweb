import stream from "stream"
// import { EventEmitter } from "events"

// Considered using https://github.com/mroderick/PubSubJS, but native is prolly better for performance.

/* eslint-disable */
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

export interface WritableObjStream<T> extends Omit<stream.Writable, "write"> {}

export class WritableObjStream<T> extends (stream.Writable as any) {
    constructor() {
        super({ objectMode: true }) // force object mode. You can merge it with original options
    }

    write(object: T, cb?: (error: Error | null | undefined) => void): boolean {
        return super.write(object, cb)
    }
}

/* eslint-disable */
export interface DuplexObjStream<T>
    extends Omit<stream.Writable, "write" | "read" | "on"> {}

export class DuplexObjStream<T> extends (stream.Duplex as any) {
    constructor() {
        super({ objectMode: true }) // force object mode. You can merge it with original options
    }

    read(): T {
        return super.read()
    }
    write(object: T, cb?: (error: Error | null | undefined) => void): boolean {
        return super.write(object, cb)
    }

    on(event: "data", listener: (obj: T) => void): this {
        super.on("data", listener)
        return this
    }
}
