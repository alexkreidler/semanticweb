# APIs and Principles

Loqu Principles

-   No Data Left Behind or Data Completeness (DC): A key axiom of the Semantic Web is the Open World Assumption, and the knowledge that real datasets have lots of properties and links that developers might not explicitly include when writing code or components. We allow developers to operate in a closed world, but we also have the NDLB option. Here, we make sure that all data is rendered in some way, with a fallback to generic components if no others are available.
-   Understandable Data Manipulation: We should follow reactive best practices to only recompute components where data has changed. We also at some point hope to allow advanced features like time travel with the dataset.


## Structure of React Components

Question: should metadata describing these structures be semantic or not? Initially, no.

Leaf Components: Rendering an entity/object and its properties in a certain way. Leaf

Optionally, leaf components can export multiple "views" of their object, for example in different situations. These views can request and show different subsets of information about the entity.

How should views be classified: their context (e.g. what component they are inside) or content: what subset of info they describe? Or both?: yes

Contexts:
- List (how to be sorted or filtered?)
  - Default: just title? +icon?
- Card (e.g. for a Grid of cards)
  - Default: icon, title (hydra:title, rdfs:title, schema:title), description
- Icon
  - Default: none/blank icon, or first letter w/ color
- Page
  - Icon
  - Title
  - Description
  - Types (and their super-classes)

Contexts can also have Features:
- Hoverable
- Clickable

Content Examples (because content varies by components):
Address
- Text
- Map
Product
- Icon (with hover)

e.g. rough RDF outline in treeish fmt
- RetailChain
  - Name
  - Locations: Set
    - Shop -> Page
      - Name (data prop) rdfs:label
      - Address (data or object prop. treated as object b/c we provide code features for it)
      - Products: Set, or Multi Link
        - Product -> Page
          - InStock
          - Price
      - Employees
        - Person -> Page
          - Name
          - JobTitle
In Entity Selector Fmt
- Entities
  - RetailChain
  - Shop
  - Product
  - Person

There are about a million ways to render and visualize this info.
A list view of shops with name, address as {text, mini icon map,}, total sales, photo of exterior

For now:
Entity Selector -> List View of Instances -> Instance Page

Page
Renders data properties as is, provide descriptions of properties on hover.
Render single object properties as Cards

Using a heading, hover for desc.
Render multiple of same object properties as list (but limit to 5)
Render rdf:list as list

Click on the heading to go to collection page
View all the items, change per-page limit, etc

Implementing the above contexts, etc:
- Slotted mode (where user passes an object containing optional props). These may be components or react elements that go into various slots within the generic component. This in general ensures DC unless user erases it from that slot. Slot components, (not elements) get access to the entire parent generic component input data. How do slot components then rearrange that for themselves? Any way adds complexity: either use HOC or `wrapped(Comp, DataSpec)` to do framing on render. However this adds an additional async step. Some slots provided by GCs are not filed
- Complete Takeover: provide frame, only render what you know, done!



Container Components: Render or display many entities in some way. This could be a List of Leafs, or just a List of GenericListItem

need to think about navigation later