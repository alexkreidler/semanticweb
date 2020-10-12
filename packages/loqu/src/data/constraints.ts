// Should this strictness type be only used for the framing operation
// Or should it be used to run additional processing on the data?
export enum Strictness {
    /** This just frames the data but doesn't impose any additional options */
    NoChecks,
    /** Frame strict mode enables both the Explicit Inclusion and the Require All
     * flags on the Frame. How to deal with no-data/error: a validation strategy? */
    FrameStrict,

    /** This checks that XSD data types are properly formatted */
    BasicValidation,

    /** This allows for custom validation using the shacl and other options. Not implemented */
    AdvancedValidation,
}
export enum Conversion {
    None,
    /** Basic conversion converts xsd data types to JS. Can JSON-LD do this or do we need another lib?
     * Right now most of our test data is exclusively string. We should test with `Number`s and `Date`s */
    BasicConversion,
}
