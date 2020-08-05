import { QuadStore } from "./index"
import { InMemoryPubSub } from "../../api/pubsub"
import { Message } from "../../api/messages"
import { ResponseTopic } from "../../api/services"

test("can create quadstore backend", async () => {
    let qs = new QuadStore()
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

    let res = await qs.start()
    expect(res.err).toBe(false)
    console.log("Result from start", res)
    let sr = await qs.stop()
    console.log(sr)
    expect.assertions(1)
    // qs = undefined
    console.log("final")
})
