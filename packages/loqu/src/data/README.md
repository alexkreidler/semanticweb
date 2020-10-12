# Developer Notes

This directory contains the core types and functionality for dealing with Loqu Data.

We provide Linked Data in several formats and interfaces
- RDF/JS
- Clownface
- JSON-LD, in a variety of forms
- Maybe RDFine?

<!-- Adding RDFine would allow us to use Alcaeus DocumentedResource for many of the Generic components -->

In general we recommend users use the JSON-LD frame format for most end applications. However to operate on a wider variety of entities, and to implement generic components we offer the others.

## Files
- `components` SemanticComponent and related types
- `constraints` `Strictness` and `Conversion` which determine other processing constraints on the data. Depending on the format this changes?
- `formats` the formats described above
- `frame` functionality for type-safe JSON-LD framing
- `functions` SemanticFunction
- `selectors` provides the types and basic selectors for SemanticComponents