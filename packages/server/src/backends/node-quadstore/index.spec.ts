import { QuadStore } from "./index"
import { InMemoryPubSub } from "../../api/pubsub"
import { Message, MessageType } from "../../api/messages"
import { ResponseTopic, QueriesTopic } from "../../api/services"

// present is browser polyfill for the same
// import present from "present"
import { performance } from "perf_hooks"
import { ulid } from "ulid"
import { BasicServer } from "../../server/server"
import { translate } from "sparqlalgebrajs"
import { pp } from "../../utils"
const present = performance.now

test("can query a quadstore backend manually", async () => {
    const a = present()
    const qs = new QuadStore()
    qs.filesToImport = [
        "./data/person.jsonld",
        "./data/person.jsonld",
        "./data/person.jsonld",
        "./data/person.jsonld",
    ]

    const res = await qs.start()
    // expect(res.err).toBe(false)
    console.log("res")

    // BasicServer.registerBackend("http", new QuadStore())

    const result = await qs.handleMessage({
        requestID: ulid(),
        type: MessageType.Query,
        op: translate("SELECT * WHERE { ?x ?y ?z }"),
    })
    expect(result).toBeDefined()

    console.log(pp(result))

    expect.hasAssertions()

    console.log("completed")
    const b = present()
    console.log("Time difference", b - a)
})
