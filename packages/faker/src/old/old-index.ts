export const version = require("../package.json").version;

import { expand } from "jsonld";

import {parseJSON} from "../input"

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

export async function process(data: any): Promise<any> {
  const result = await expand(data);
  console.log(result);
  console.log(JSON.stringify(result));
  
  return result;
}

// export async function generate(input: any): any {
  
// }