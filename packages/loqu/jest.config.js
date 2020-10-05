module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",

    // A bit of a quirk from rdfine's jest config
    moduleNameMapper: {
        "@rdf-esm/(.*)": "@rdfjs/$1",
    },
}
