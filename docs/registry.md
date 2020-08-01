# Frontend Semantic Web Component Registry

After spending way too much time testing and rewriting React code, I learned that the `compact` algorithm only supports creating a JSON-like structure, but preserves entire IRIs by default.

From the spec:

> If no term was found that could be used to compact the IRI, an attempt is made to compact the IRI using the active context's vocabulary mapping, if there is one. If the IRI could not be compacted, an attempt is made to find a compact IRI. A term will be used to create a compact IRI only if the term definition contains the prefix flag with the value true. If there is no appropriate compact IRI, and the compactToRelative option is true, the IRI is transformed to a relative IRI reference using the document's base IRI. Finally, if the IRI or keyword still could not be compacted, it is returned as is.

There is the `compactToRelative` option which goes to the @base IRI.

Lesson learned-just use full IRIs

> When you chair standards groups that kick out “Semantic Web” standards, but even your company can’t stomach the technologies involved, something is wrong

http://manu.sporny.org/2014/json-ld-origins-2/
