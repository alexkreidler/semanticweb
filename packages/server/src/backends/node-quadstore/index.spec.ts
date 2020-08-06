import { QuadStore } from "./index"
import { MessageType, Message, Response } from "../../api/messages"

import { ulid } from "ulid"
import { translate } from "sparqlalgebrajs"
import { pp } from "../../utils"

describe("quadstore", () => {
    let qs: QuadStore
    beforeAll((done) => {
        qs = new QuadStore()
        qs.filesToImport = ["./data/person.jsonld"]

        qs.start().then((res) => {
            done()
        })
    })
    test("can query a quadstore backend manually", async () => {
        // BasicServer.registerBackend("http", new QuadStore())

        const result = await qs.handleMessage({
            requestID: ulid(),
            type: MessageType.Query,
            op: translate("SELECT * WHERE { ?x ?y ?z }"),
        })
        expect(result).toBeDefined()

        // console.log("FINAL RESULT")

        // console.log(pp(result))

        expect.hasAssertions()

        console.log("completed")
    })

    test("can query a for details", async () => {
        const result = await qs.handleMessage({
            requestID: ulid(),
            type: MessageType.Query,
            op: translate(
                "SELECT * WHERE { ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://schema.org/Person> }"
            ),
        })
        expect(result).toBeDefined()
        expect(result.err).toBe(false)
        const r = result.unwrapOr(false)
        expect(r).toBeTruthy()
        expect((r as Message).type).toBe(MessageType.Response)
        const resp = r as Response
        console.log(pp(resp))
    })

    /**
     * TODO much later
     * This memory leak issue may never be solved.
     * 1. Use an on-disk store to see if that's the issue and see if detectFileHandles can do that
     * 2. Do more in-depth profiling. For example, bring in a large (7mb file) into memory on every handleMessage
     * 3. Just FIND OUT where any continuing to execute promises are
     */

    afterAll((done) => {
        qs.stop().then((res) => {
            console.log(res)
            expect(res.err).toBe(false)
            done()
        })
    })
})
