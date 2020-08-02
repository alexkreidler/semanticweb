# Handling API Queries

GraphQL
Translate each named field in the schema into the proper RDF triple request
There may be nested requests.

HTTP/JSON-LD:
GET /resource/:id
retrieves all triples with subject :id

GET /(resource_name_plural, resource_collection)
retrieves Key Values for all triples where the Node is of type Resource Type
Key Values represent key RDF predicates to extract from each found Node
By default, maybe just ID and last_updated

POST /res_collec
creates a new Node and all required triples from specified JSON-LD
Runs any validation logic defined by a @semanticweb/validation lib which is a mapping of types to validator functions
This can be configured

POST /resource/:id
Updates that specific resource, similar to above

support PUT/PATCH??

DELTE considerations:
some other Nodes may link to that node which would cause the graph to be inconsistent
Thus: run a <any subject> <any predicate> <specific object> search to check if there are any links to the object
before deletion. If so, return an error. Maybe this functionality could be configured??

PATCH - would also need a batch of RDF requests to get entire data of node (or data - data provided)

^^ above described more complex logic could impose significant performance/network cost

Also, maybe support more complex graph data model queries: like
/graph/subjectID/any/objectID
To find immediate links

However, most traditional REST business use-cases that follow the RBDMS (e.g. update one node/row/value) will not need this

Other APIs:
SPARQL - could be mapped fairly natively??
do we need a subset to simplify implementation?

## Generic configurable options

-   Use a builtin ULID generator for IDs or allow custom IDs
-   Allow inserting/updating deleting triples that link to an invalid ID? if above, then prolly not
-   Allow deleting nodes that are referenced by existing triples
