import { Algebra, toSparql, translate } from "sparqlalgebrajs"
test("minimal reproduction of Sparql Algebra error", () => {
    // Turns out it was user error for having TermType undefined on items in the variables array.
    // The README is misleading here: https://github.com/joachimvh/SPARQLAlgebra.js#translate
    // Also, it should probably be error resistant
    // VSCode debugger to the rescue
    const os = ["x", "y", "z"]

    const pt = os.map((n) => ({
        termType: "Variable",
        value: n,
    }))
    const op: Algebra.Operation = {
        type: "project",
        input: {
            type: "bgp",
            patterns: [
                {
                    subject: pt[0],
                    predicate: pt[1],
                    object: pt[2],
                    graph: {
                        // termType: "DefaultGraph",
                        /**
                         * Contains an empty string as constant value.
                         */
                        value: "",
                    },
                    type: "pattern",
                },
            ],
        },
        variables: pt,
    }

    const result = toSparql(op)

    expect(result).toBeDefined()
})

test("algebra test 2", () => {
    const opResult = translate("SELECT * WHERE { ?x ?y ?z }")

    expect(opResult).toBeDefined()
})

test("algebra test 3", () => {
    const opResult = translate("SELECT * WHERE { ?x ?y ?z }")

    expect(opResult).toBeDefined()

    const result = toSparql(opResult)
    expect(result).toBeDefined()
})
