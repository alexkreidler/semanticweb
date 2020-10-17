export enum UIContext {
    ListItem = "http://loqu.dev/schema/uiContexts/ListItem",
    Card = "http://loqu.dev/schema/uiContexts/Card",
    Icon = "http://loqu.dev/schema/uiContexts/Icon",
    Page = "http://loqu.dev/schema/uiContexts/Page",
}

/** This metadata helps us narrow the selection, and allows distinguishing between different UI views of the same object.
 * It may be assigned a JSON-LD/rdf meaning
 */
export type Metadata = {
    // componentID: string
    // componentGroup: string
    uiContext?: UIContext
}
