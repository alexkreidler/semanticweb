/**
 * Loqu is backed by a RDF/JS dataset.
 * It may contain multiple named graphs for each URI that data
 * is fetched from. The default graph should contain metadata
 * about those named graphs including which protocol the triples
 * were requested with (SPARQL, Hydra, etc). It's our goal to
 * have changes to the dataset be tracked deterministically
 * so they can be rolled forward and backwards.
 * In fact, if the Dataset is a MobX observable or similar,
 * then all relevant computed values (JSON-LD provided to components)
 * could get recomputed, and components re-rendered.
 */
export interface Loqu {}
