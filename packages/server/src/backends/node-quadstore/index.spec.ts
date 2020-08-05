import { QuadStore } from "./index"
import { InMemoryPubSub } from "../../api/pubsub"
import { Message } from "../../api/messages"
import { ResponseTopic } from "../../api/services"

// present is browser polyfill for the same
// import present from "present"
import { performance } from "perf_hooks"
const present = performance.now

test("can create quadstore backend", async () => {
    const a = present()
    const qs = new QuadStore()
    const qb = new InMemoryPubSub<Message>()
    const rb = new InMemoryPubSub<Message>()
    qs.queryBroker = qb
    qs.responseBroker = rb

    rb.subscribe(ResponseTopic, (m) => {
        console.log("Got message:", m)
    })

    qs.filesToImport = [
        "./data/person.jsonld",
        "./data/person.jsonld",
        "./data/person.jsonld",
        "./data/person.jsonld",
    ]

    const res = await qs.start()
    expect(res.err).toBe(false)

    const _ = await qs.stop()
    expect.assertions(1)

    console.log("completed")
    const b = present()
    console.log("Time difference", b - a)
})
