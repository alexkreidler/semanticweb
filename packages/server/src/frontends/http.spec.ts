import { HTTPFrontend } from "./http"

import { Backend } from "../api/services"
import { mock } from "jest-mock-extended"
import request from "request"
import { Ok } from "ts-results"
import { resolve } from "path"
import { MessageType, Message } from "../api/messages"

describe("http server", () => {
    // Unfortunately, with this limited of a mock, any response from backend will be undefined, which will not allow the service to return real data
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

    test("can make a basic request, get no result error", async () => {
        await new Promise((resolve, reject) =>
            request("http://0.0.0.0:9000/book", (err, resp, body) => {
                console.log("got response")

                // Since we don't implement the mock besides undefined, we should get an error
                expect(err).toBeDefined()
                expect(resp).toBeDefined()

                const res = JSON.parse(body)

                expect(res ? res.error : undefined).toBeDefined()

                expect(MockedBackend.handleMessage).toHaveBeenCalledTimes(1)
                resolve()
            })
        )
        expect.assertions(4)
    })

    test("gets response for pre-loaded Person objects", async () => {
        MockedBackend.handleMessage.mockReturnValueOnce(
            new Promise((resolve, reject) => {
                resolve(
                    Ok({
                        requestID: "MOCK-01",
                        type: MessageType.Response,
                        quads: [],
                    } as Message)
                )
            })
        )
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
