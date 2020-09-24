import { promises as fs } from "fs"
import { join } from "path"

// Parses JSON for NodeJS environments
export async function parseJSON(filename: string): Promise<any> {
    return fs.readFile(join(__dirname, filename), "utf8").then((text: string) => JSON.parse(text))
}

export function prettyPrint(data: any): string {
    return JSON.stringify(data, undefined, 4)
}
