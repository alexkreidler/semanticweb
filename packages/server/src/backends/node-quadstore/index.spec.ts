import { QuadStore } from "./index"
import { InMemoryPubSub } from "../../api/pubsub"
import { Message } from "../../api/messages"
import { ResponseTopic, QueriesTopic } from "../../api/services"

// present is browser polyfill for the same
// import present from "present"
import { performance } from "perf_hooks"
import { ulid } from "ulid"
const present = performance.now

// test("can create quadstore backend", async () => {
//     const a = present()
//     const qs = new QuadStore()
//     const qb = new InMemoryPubSub<Message>()
//     const rb = new InMemoryPubSub<Message>()
//     qs.queryBroker = qb
//     qs.responseBroker = rb

//     rb.subscribe(ResponseTopic, (m) => {
//         console.log("Got message:", m)
//     })

//     qs.filesToImport = [
//         "./data/person.jsonld",
//         "./data/person.jsonld",
//         "./data/person.jsonld",
//         "./data/person.jsonld",
//     ]

//     const res = await qs.start()
//     expect(res.err).toBe(false)

//     const _ = await qs.stop()
//     expect.assertions(1)

//     console.log("completed")
//     const b = present()
//     console.log("Time difference", b - a)
// })

test("can query a quadstore backend", async () => {
    const a = present()
    let qs = new QuadStore()
    let qb = new InMemoryPubSub<Message>()
    let rb = new InMemoryPubSub<Message>()
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
    // expect(res.err).toBe(false)
    console.log("res")

    rb.subscribe(ResponseTopic, (m) => {
        console.log("recieved message")

        console.log(m)

        expect(m).toBeDefined()
    })
    console.log("mid")

    await qb.publish(
        QueriesTopic,
        {
            requestID: ulid(),
            type: "query",
            op: {
                type: "project",
                input: {
                    type: "bgp",
                    patterns: [
                        {
                            type: "pattern",
                            subject: "?x",
                            predicate: "?y",
                            object: "?z",
                        },
                    ],
                },
                variables: ["?x", "?y", "?z"],
            },
        },
        true
    )
    expect.hasAssertions()

    qs = undefined
    qb = undefined
    rb = undefined

    console.log("completed")
    const b = present()
    console.log("Time difference", b - a)
})
