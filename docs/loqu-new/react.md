# The linked HOC

It allows passing any `DataFormat` as `data` prop. In fact, it even allows passing a `url={"bla"}` prop that will dereference to a dataset, using rdf-dereference
```ts
type Data = {
    url: string
    iri: string
}
```