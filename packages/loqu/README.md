# Loqu

The Loqu core JS library provides some powerful and unique programming patterns for working with Linked Data in JS.

Some of the architecture discussions in the initial README get into the weeds of RDF and graph structures as this is how it works behind the scenes. However, the features are simply to use and operate on regular JS objects. We will move arch info somewhere else soon.

## Semantic Web Components

They are, most simply, a regular JS component (currently only React is supported), and a data input definition, in this case a JSON Frame.

This allows the component to take in varying levels of flexible data.

### Digression: data flexibility

When writing traditional software developers highly prize languages and tools that offer static typing and schemas and methods for validating data, as this brings determinism into their systems. However, we also understand that sometimes we don't have a value for every field we've defined, leading to the creation of Null.

As developers trying to build new data-centric applications, we have to expand our viewpoint so we are more willing to work with data that is less or more than we would like.

### About JSON-LD and schemas

JSON-LD Frames themselves can act somewhat like schemas. There is a flag to not include any properties which are not included in the frame (thus pruning extraneuos information). I'm not sure, but I think there is a way to require a property (which would be validation), thus the Frame itself would be the validation.

However, if we have to extend it too much so its non-standard, we won't and will just go with other methods listed.

**Most Flexible**: Simply using the JSON-LD Frame, any properties and nested nodes are arranged in the provided format. However, properties and nodes are not validated in any way by default

**Medium Flexibility**: We perform some basic validation on builtin literal datatypes like the XSD types. Optionally, we convert them to the native JS types. However, in this mode, we still don't know with any certainty which properties will be defined on the object.

We may instrument the object with Accessors to warn if not all properties are used. This is useful to determine if the component is ignoring information that is useful. This is disabled in non-development environments.

**Least Flexibility**: The user provides a SHACL or JSON-Schema validation routine to enforce before passing in the data. This makes sure that at a minimum, the defined properties are provided. However, the user may also set a flag that enables additional properties or disallows them, with an addditional flag to error or drop silently.

Theoretically, in Typescript, we should provide concrete TS types for the input props then. However this may require more tooling (e.g. OpenIDL). One could create a single definition and then generate both the SHACL/JSON-Schema and TS types. However, many wouldn't want to do this, so if possible, we should look into automatically generating the types from the `validation` field literal.

```ts
type SemanticComponent = {
    spec: {} // a JSON-LD Frame
    component: React.FC
    validation: {} // A SHACL or JSON-Schema validation routine to enforce before passing in the data
}
```

Some of the features described above, including literal validation and schema based validation, use some of the advanced processing capabilities in the Loqu library.

_How do we deal with some JSON-LD and a link to a data node IRI that needs to be included in the object_

### Builtin/Generic Web Components

JSON-LD frames provide a great way to format data that we know a little about ahead of time. However, when we're trying to render a fully generic Linked Data browser that has no inherent knowledge of the data, we need another option.

This is implemented in the `GenericNode.tsx` file. What we want is:

-   compact the input data so that every field is an absolute IRI
-   use `rdf-dereference` to dereference the rdf:type field. At least for schema.org, this pulls in both the data about the class itself, but also data on its properties, which we are about to render. If we had to dereference every field in a separate request, we could parallelize it but it would still be pretty slow
-   then we iterate over the object and get the fields/properties that have only single values or array values. We then render those in their object order on the page. To render more detail about the property itself, we try to render the `rdfs:label`. On hover, we render `rdfs:comment` If none are available, we have a function try to determine the field name (this could be a case for non-compacted input). How to get access to the property triples: either JSON-LD or direct triple store access

1. compact(input, {})
2. getProperties(input[@type], every string or array field in input)
3. render data from above 2
4. render nested objects by simply passing into GenericNode again

## Advanced Data Processsing

In general, most of the processes described below use the same internal model (e.g. recursive). We provide a consistent API, similar to the middleware next() function, which indicates the completion of processing on one node and allows lower nodes to process.

Since the JSON-LD/RDF data model is a graph, there are many processing models. Some functionality, like Validation, may be functional and node-local, meaning that the graph can be processsed in parallel. Some, like conversion, is also functional and triple-local, so the edge/leafs can be processed in parallel.

Some validation routines may require context from parent or child nodes?? Need to think of examples. And some more complex generation routines need that context as well, resulting in a DAG of processing.

All of these performance features are handled behind the scenes with promises. We don't anticipate the library being used on gigantic graphs/triple stores, as the target environment are web browsers and frontends, not backend environments. Additionally, one can likely perform the main features included (validation, conversion, and generation) more performantly in other languages and libraries.

However, when a given option (such as indicating that a given operation e.g. a validaiton function is deterministic/functional) impacts performance, we will indicate as such. We also hope to link to the architecture docs that describe how the option changes the internal execution.

### Validation

#### Literal Validation

In this scenario, the system needs two triples:

1. Property Range DataType
   and
2. Node Property Literal

The first determines which data validator to use, the second the input to that validator.

Algorithm: for a given JSON-lD object, we convert to RDF and find all triples with literals (e.g. #2). From there, we can create a set of all the properties used. Then for each unique property used, we can go dereference that ontology, parse it, and find the datatype of the property. Some ontologies may use multiple layers of custom datatypes, which we should resolve to either a base datatype that the Loqu library itself supports, or a base custom datatype that we check in the user library of validators. If it is not found there, then we error the validation with DataType not Found.

Once we have the DT, we can then associate that with the literal. _optional We can then pass this to our work management system which can prevent overloading with promises (is this a thing in Node, or does it just pause CPU work)_ Then we do the validation function lookup and run it on the literal. We get a result

```ts
type LiteralValidationResult = {
    valid: boolean
    error: any // the specific validation error if failed
}
```

Then we handle any invalid edges via a Validation Strategy provided by the Requesting Component. We can fail on any, pass through invalid, drop invalid, etc. Validation strategy can even be based on the node and property of the triple itself, or the datatype (e.g. we allow user to provide custom strategy given the two triples and result)

#### Node Validation

The SHACL or JSON-LD schemas will indicate to the system which properties need to be fetched. In fact, there are great libs that validate SHACL from JSON-LD and JSON-Schema from JSON, so we'll just use those most likely.

#### Custom Validation

This is the more general situation where a user wants to write a custom validator or set of them, pass their own configuration, etc.

Here, we make a distinction between Functional and Not, Node-Local, and Context requiring.

// Does functional vs not have any impact for us? Performance? what?
In general a functional validator means the same data will produce the same result, valid or not valid. However, there are cases like: the date provided before Today, in which the result depends on information that is external (the time). However this external state can be included with the context to make it functional

The more pressing issue is Local vs Non-local. Local validators only need access to the currently active node and its properties. They may view the IRIs values of properties that link to other nodes, but not their data. Non-local validators may need access to data many steps on the graph away, in either direction (e.g. parents or children -- this is where the graph has already become a tree).

In general, if a graph is already fully generated, this again doesn't have any impact: unless we do some more agressive optimizations like say: a Node is invalid if any properties are invalid, which means we can terminate the validation earlier. This may work for the schema validation described above

However, since custom validators can use any logic in JS, we can't assume that a node's validity depends on its children. It may be a combination of valid and invalid chilren.

Thus, when fully generated, the local issue won't be a problem.

However, when data needs to be generated or changed, non-local nodes will introduce dependencies into the DAG that may be many links away. It is also possible that a generation rountine and validation routine cannot be interspersed, and that validation should just happen as a separate step after the graph is fully generated.

Again, premature optimization.

### Conversion

Conversion involves converting literals of a type into another representation that is valid in that type, or converting nodes of a class to another node that is valid in that class. (e.g. See Time ontology, converting from days, months etc properties into dateTime property as XSD:datetime)

We don't support converting into representations that are invalid, so for a conversion to be allowed, there must be a validation defined that will run after.

### Generation

Generation involves taking a graph with literals with some content (usually empty), and generating the values for them.

Generation may depend on: the value in the literal itself, the type of the literal, the property, and the node.

Complex generation means non-local generation that needs information from nodes higher in the tree.

In general, a good pattern for a generator is to create an Ontology for the fake/generated dat it can represent, and then create a mapping from `node property` to `GeneratedValue`, which, can then be called.

## OOP with Linked Data

We also want to provide a mechanism to use more OOP-based techniques with Linked Data literals and Nodes.

First, we want to provide computational elements to custom datatypes.

We then may want to look into mapping JSON-LD nodes (e.g. objects) into classes that have the same or a minimal set of fields (e.g. validation) from those nodes.

However this means the data is harder to rearrange and use all the LD features.

So instead we may just want to provide functions that can be called on LD objects.

## Name

The name `loqu` is from the Latin root "loqu" which means to talk or speak. We believe that Linked Data provides the best opportunity for applications to communicate and understand one another. We also particularly like the word "eloquence" as applied to code, and believe the Loqu Project allows developers to write less code that is more concise and beautiful.
