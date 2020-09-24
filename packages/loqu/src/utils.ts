import { promises as fs } from "fs"
import { join } from "path"

// Parses JSON for NodeJS environments
export async function parseJSON(filename: string): Promise<any> {
    return fs.readFile(join(__dirname, filename), "utf8").then((text: string) => JSON.parse(text))
}

export function prettyPrint(data: any): string {
    return JSON.stringify(data, undefined, 4)
}

/** This probably won't work for non-Node environments. TODO */
export function stream2String(stream: NodeJS.ReadableStream, enc?: BufferEncoding): Promise<string> {
    var str = ""

    return new Promise(function (resolve, reject) {
        stream.on("data", function (data) {
            str += typeof enc === "string" ? data.toString(enc) : data.toString()
        })
        stream.on("end", function () {
            resolve(str)
        })
        stream.on("error", function (err) {
            reject(err)
        })
    })
}