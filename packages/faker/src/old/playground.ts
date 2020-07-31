import { address } from "faker";

export const version: string = "0.1.0";

// The following is outputted. TODO: think about using a module bundler like Rollup
// For now, `tsc` offers the simplest solution to start building on
const unexportedstring: string = "hello world";

import { schema } from "@tpluscode/rdf-ns-builders";
import { NamedNode, Dataset } from "rdf-js";

console.log(schema.email.value);

import { vocabularies } from "@zazuko/rdf-vocabularies";

export async function match() {
  vocabularies({ only: ["schema"] }).then((datasets) => {
    const s: Dataset = datasets["schema"];
    const result = s.match(schema.birthPlace);
    console.log(result);
  });
}

// const schemaPerson: NamedNode = schema.Person

// console.log("Starting with version:", version, address.zipCode());
