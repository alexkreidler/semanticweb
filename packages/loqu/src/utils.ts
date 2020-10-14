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

export function arrCmp<T>(a1: T[], a2: T[]): boolean {
    var i = a1.length
    while (i--) {
        if (a1[i] !== a2[i]) return false
    }
    return true
}
export function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here")
}

export class UnreachableCaseError extends Error {
    constructor(val: never) {
        super(`Unreachable case: ${val}`)
    }
}

export const findSimilarity = (first: any, second: any): number => {
    const firstLength = Object.keys(first).length
    const secondLength = Object.keys(second).length
    const smaller = firstLength < secondLength ? first : second
    const greater = smaller === first ? second : first
    const count = Object.keys(smaller).reduce((acc, val) => {
        if (Object.keys(greater).includes(val)) {
            // TODO maybe?: add recursion for nested objects
            // if (typeof greater[val] == "object") {

            // }
            if (greater[val] === smaller[val]) {
                return ++acc
            }
        }
        return acc
    }, 0)
    return (count / Math.min(firstLength, secondLength)) * 100
}
