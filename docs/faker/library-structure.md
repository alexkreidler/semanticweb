# library structure

The @semanticweb libraries should be structured as follows:
- @Semanticweb/core - basic additional features + data model on top of very basic JSON-LD features
  - `Representation`s - to understand data when it doesn't strictly follow JSON-LD schema
  - `IFetcher` - The fetcher interface to use
- @semanticweb/cache or /fetcher - an isomorphic data fetching library that supports caching and predownloading vocabularies
- @sw/mapping - The mapping library - decodes SW data and calls a given function on each node. Gracefully handles breaking down representations
- @sw/faker - uses mapping, but also supports generating complex `Representation` values

Each of these components could be written in a single repository as modules and then broken out into separate packages if it calls for that.

Build a nice documentation site to hold the ideation and documentation for the library.


Additional items
- Build a VSCode extension that uses faker library to create data right in the editor
- Build an extension that understands JSON-LD for labels and completion
  - Maybe build this into the built-in JSON language service, maybe add a whole new language identifier
- Build an extension that enables arbitrary actions or useful functions based on the SW schema
  - E.g. for a Place, run a geocoding function with G Maps API and open in Google Maps
  - For a Person, have commands to open their homepages or socials? - could just click not a useful function
  - Person - add to contacts API