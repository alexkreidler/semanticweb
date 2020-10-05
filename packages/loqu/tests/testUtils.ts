import ns from "@rdf-esm/namespace"
import { prefixes } from "@zazuko/rdf-vocabularies"

import rdf from "rdf-ext"
import DatasetExt from "rdf-ext/lib/Dataset"
import stringToStream from "string-to-stream"
import Parser from "@rdfjs/parser-n3"
import { TurtleTemplateResult } from "@tpluscode/rdf-string"

const parser = new Parser()

export function parse(quads: string | TurtleTemplateResult): Promise<DatasetExt> {
    const stream = stringToStream(quads.toString())

    return rdf.dataset().import(parser.import(stream))
}

prefixes.ex = "http://example.com/"
export const ex = ns(prefixes.ex)
