export const version = require("../package.json").version;

import { promises as fs } from "fs";
import { join } from "path";

import { expand } from "jsonld";

// Parses JSON for NodeJS environments
export async function parseJSON(filename: string): Promise<any> {
  return fs
    .readFile(join(__dirname, filename), "utf8")
    .then((text: string) => JSON.parse(text));
}

export async function rexp(filename: string): Promise<any> {
  const data = await parseJSON(filename);
  console.log(data);

  const result = await expand(data);
  console.log(result);
  console.log(JSON.stringify(result));
  

  // console.log(JSON.stringify(result));
  return result;
  return null;
}

// export async function generate(input: any): any {
  
// }