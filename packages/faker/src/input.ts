import { promises as fs } from "fs";
import { join } from "path";

import {BasicInput} from "./index"
// Parses JSON for NodeJS environments
export async function parseJSON(filename: string): Promise<any> {
  return fs
    .readFile(join(__dirname, filename), "utf8")
    .then((text: string) => JSON.parse(text));
}

export async function parseInput(filename: string): Promise<BasicInput> {
    return parseJSON(filename)
}