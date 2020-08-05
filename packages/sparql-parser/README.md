# SPARQL-parser

This is a Typescript library that parses SPARQL expressions from strings and converts it into the SPARQL.js JSON format commonly used by many libraries in the JS RDF ecosystem.

It uses [millan](https://github.com/stardog-union/millan) a parser for various graph languages, which uses [Chevrotain](https://sap.github.io/chevrotain/docs/), a powerful parser library, under the hood. It is known as one of the [fastest](https://sap.github.io/chevrotain/docs/features/blazing_fast.html) parsing tools available in JS.

However, the output from millan is a low-level parse tree, which is inconvenient to work with. This library transforms it into a [simpler format](https://github.com/RubenVerborgh/SPARQL.js/) that is used by several libraries, including [node-quadstore] and [sparql-algebra].
