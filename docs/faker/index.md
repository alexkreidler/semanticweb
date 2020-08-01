# Design Docs for JSON-LD Semantic Web faker

A good fake data generator is a tough undertaking.

Simple surface-level generators are available in virtually any language and on many sites.

First a few premises:
- Semantic Web technologies will make generating realistic fake data easier
  - Actually identifying the meaning of basic content: e.g. [schema.org/email](http://schema.org/email)
  - Allowing for understanding fake data as a graph, and thus generating realistic structures (e.g. on average, a social network has users with around 10 friends and only very few with more than 100). This allows us to possibly take advantage of research in the graph network space.


However, for now, let's limit ourselves to first-degree fake data generation, e.g. only the properties directly defined on a given class or object.

The [`data/person.jsonld`](../data/person.jsonld) file shows a good example of this. However, loading it into [JSON-LD Playground](https://json-ld.org/playground/) and viewing in either the flattened view (this outlines all of the named and unnamed nodes in the RDF graph data model) or the visualization view (it groups properties that have multiple values, e.g. duplicated predicates, which is a little misleading) makes it clear that actually the address value is a second-order value as it is one graph node away.

Some values that are linked actually are not fully referenced properly.

For example, the [schema.org/birthPlace](http://schema.org/birthPlace) is supposed to be a `Place` (e.g. a node with a set of properties including `address` (either `PostalAddress` complex object or simply `Text`) and more), but is actually represented as a string: `"Philadelphia, PA"`.

It seems clear that with the semantic understanding that `"Philadelphia, PA"` is supposed to be a `https://schema.org/Place`, one could then call into a geocoding API to generate additional information such as the `PostalAddress` mentioned earlier or even the `GeoCoordinates`, etc of the place.

It also seems that there is generally a pattern for when and how shorthands such as text are used to represent more complex objects like `Place`s. `"Philadelphia, PA"` is simply a `DataType` `Text`, but that is an option on the `address` property of `Place`. Thus it seems `address` is the key or core or "representative" field of the object. 

In terms of fake data generation, one could generate a text version of address via some programmatic combination of `PostalAddress` properties.

A similar thing happens with the `alumniOf` property. In the JSON-LD representation, it is simply `"Dartmouth"`, which is not a `EducationalOrganization` or `Organization` by itself. It may refer to an  `EducationalOrganization` with the `name` `"Dartmouth"` but that would take an additional search, or creation for it to happen.

## Algorithm
Thus for data generation, the idea is as follows:

- Get the input structure
  - For now this is one node
  - We allow the user to define which properties to generate and which not to
  - These sets of properties may be saved as "profiles" or similar which allow a base of data to be generated. We may allow combining or diffing profiles in the future. They are simply unordered sets.
- Get all properties that are enabled via above
- For simple properties, like `schema.org/email` (a.k.a the property is a raw `DataType`), simply look up in a map of IRIs to fake data generation functions. Boom, your simple value has been generated
- For complex properties, like `birthPlace` and `alumniOf`, do the following
  - Find the most specific class in the range: e.g. between EducationalOrganization and Organization, choose EducationalOrganization because it is a child of Organization
  - generate **core/representative** details about it
    - e.g. for EducationalOrganization all you need is `name`: Dartmouth, Stanford, Harvard, etc
    - for PostalAddress you may need all the fields because they then can be combined for a specific-enough address. At a minimum it should be a city location like Pittsburgh PA


## Additional considerations/caveats

### Subject-predicate rules
We may want to add specific generation rules based not just on the property type of the downstream value (like `email`) but also on the subject itself.

E.g. the range of valid `height`s for a `Person` is much different than those for `VisualArtwork`

### Multiple vocabularies
Schema.org is great, now how do we extend this library?
