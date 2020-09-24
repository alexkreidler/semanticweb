export type JsonLdObj = object
export type JsonLdArray = [JsonLdObj]
export type JsonLd = JsonLdObj | JsonLdArray

type DOMString = string
// type LoadDocumentCallback = (url: Url) => Promise<RemoteDocument>

export type Url = DOMString
export type Iri = Url
export type Document = JsonLd | Url
export type Context = Document
export type Frame = JsonLdObj | Url
