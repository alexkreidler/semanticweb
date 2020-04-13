import { NamedNode, Dataset } from "rdf-js";

/* # Input
* This section defines the input structure of the API

* BasicInput requires all the fields that are needed to process a requested fake document
* All fields to generate should simply contain true, but the type and context may optionally be strings. The input will be parsed with JSON-LD to get the fully normalized requested value
*/
export type BasicInput = { [key: string]: true } & (
  | { "@type": string }
  | { "@type": string; "@context": string }
);

// Mapping
// This sectinon of the API allows the core library to map simple values such as schema:email to generator functions

type FunctionMap = { [key: string]: Function };

// The simplified map is how all of our data is represented at first. Then it is processed by adding the prefix to the key of the function map.
type SimplifiedMap = { [prefix: string]: FunctionMap };

export interface MapProcessor {
  // This function adds the prefix to the key of the function map.
  expand(input: SimplifiedMap): TypeGeneratorMap;
}

// TypeGeneratorMap is a map from fully-qualified Semantic Web IRIs to a function which generates representative data
export type TypeGeneratorMap = { [semanticType: string]: Function };

// Complex properties
// These will only be tried if the simply properties have failed
// For thesse, the system needs a way to determine the effective "type" of the property, which it can then pass to the simple MapProcessor
// It needs support for dereferencing these IRIs

// Implementation note: for now, we don't want to hard code in rdf-vocabularies if possible. Let's just encode a few core ones like
// http://schema.org/rangeIncludes and similar

export interface ComplexPropertyProcessor {
  node: NamedNode;

  // fetches the data from the given IRI
  fetchData(): Promise<Dataset>;
  readonly data: Dataset;

  // returns the effective type of the node
  // this can then be looked up if in the mapping if it is a simple value
  // if not, it needs to be represented
  getType(): NamedNode;
}

export const ex: TypeGeneratorMap = {};
export const inp: FunctionMap = {}; 
// interface

// export interface Generator {
//   semanticMap;
// }
