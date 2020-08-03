declare module "quadstore" {
    import { Readable } from "stream"
    import { AbstractLevelDOWN } from "abstract-leveldown"
    import { Term, Source, Stream, Quad } from "rdf-js"
    export class RdfStore implements Source {
        constructor(abstractLevelDown: AbstractLevelDOWN, options?: any)
        match(
            subject?: Term,
            predicate?: Term,
            object?: Term,
            graph?: Term
        ): Stream<Quad>
        import(stream: Stream<Quad>): Readable
    }
}

// Could also use @types/quadstore, not maintained well
// Type definitions for quadstore 6.x
// Project: https://beautifulinteractions.github.io/node-quadstore/
// Definitions by: Brian Cort <https://github.com/thatcort/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
