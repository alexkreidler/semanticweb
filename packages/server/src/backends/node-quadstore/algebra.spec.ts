import { Algebra, toSparql, translate } from "sparqlalgebrajs"
test("minimal reproduction of Sparql Algebra error", () => {
    // Turns out it was user error for having TermType undefined on items in the variables array.
    // The README is misleading here: https://github.com/joachimvh/SPARQLAlgebra.js#translate
    // Also, it should probably be error resistant
    // VSCode debugger to the rescue
    const os = ["x", "y", "z"]
    console.log(os)

    const pt = os.map((n) => ({
        termType: "Variable",
        value: n,
    }))
    const vs = os.map((n) => ({
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
    console.log(pp(op))

    const result = toSparql(op)
    console.log(result)
    expect(result).toBeDefined()
})

const pp = (i: any) => JSON.stringify(i, undefined, 2)

test("algebra test 2", () => {
    const opResult = translate("SELECT * WHERE { ?x ?y ?z }")
    console.log(pp(opResult))
    expect(opResult).toBeDefined()
})

test("algebra test 3", () => {
    const opResult = translate("SELECT * WHERE { ?x ?y ?z }")
    console.log(pp(opResult))
    expect(opResult).toBeDefined()

    const result = toSparql(opResult)
    expect(result).toBeDefined()
    console.log("final", result)
})
