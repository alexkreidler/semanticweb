import { HTTPFrontend } from "./http"

import { Backend } from "../api/services"
import { mock } from "jest-mock-extended"
import request from "request"

describe("http server", () => {
    const MockedBackend = mock<Backend>()

    let frontend
    beforeAll(async () => {
        frontend = new HTTPFrontend()

        frontend.backend = MockedBackend

        frontend.configure({
            mapping: [
                {
                    name: "person",
                    type: "schema:Person",
                },
                {
                    name: "book",
                    type: "schema:Book",
                },
            ],
        })
        await frontend.start().then(() => {
            console.log("started")
        })
    })

    beforeEach(() => {
        MockedBackend.handleMessage.mockClear()
    })

    test("can make a basic request", async () => {
        await new Promise((resolve, reject) =>
            request("http://0.0.0.0:9000/book", (err, resp, body) => {
                console.log("got response")

                expect(err).toBeNil()
                expect(resp).toBeDefined()

                const res = JSON.parse(body)

                expect(res ? res.error : undefined).toBeNil()

                expect(MockedBackend.handleMessage).toHaveBeenCalledTimes(1)
                resolve()
            })
        )
        expect.assertions(4)
    })

    test("gets response for pre-loaded Person objects", async () => {
        await new Promise((resolve, reject) =>
            request("http://0.0.0.0:9000/book", (err, resp, body) => {
                console.log("got response")

                expect(err).toBeNil()
                expect(resp).toBeDefined()

                const res = JSON.parse(body)

                expect(res ? res.error : undefined).toBeNil()

                console.log("Person", res)

                expect(MockedBackend.handleMessage).toHaveBeenCalledTimes(1)
                resolve()
            })
        )
        expect.assertions(4)
    })

    afterAll(async () => {
        console.log("stopping")

        await frontend.stop()
    })
})
