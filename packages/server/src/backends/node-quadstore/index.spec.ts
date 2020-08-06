import { QuadStore } from "./index"
import { MessageType, Message, Response } from "../../api/messages"

// present is browser polyfill for the same
// import present from "present"
import { performance } from "perf_hooks"
import { ulid } from "ulid"
import { translate } from "sparqlalgebrajs"
import { pp } from "../../utils"
const present = performance.now

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
    afterAll((done) => {
        qs.stop().then((res) => {
            console.log(res)
            expect(res.err).toBe(false)
            done()
        })
    })
})
